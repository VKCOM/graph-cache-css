const postcss = require('postcss');
const Graph = require('graphlib').Graph;
const fs = require('fs').promises;
const path = require('path');

async function resolveFile(curDir, fileName, paths = []) {
  const pathVariants = [curDir, ...paths].map(basePathVariant => path.resolve(basePathVariant, fileName));
  for (const pathVariant of pathVariants) {
    try {
      await fs.stat(pathVariant);
      return pathVariant;
    } catch (e) {}
  }
  throw new Error(`fileName not found, tried: \n${pathVariants.join('\n')}`)
}

function extractPathFromImport(importParams) {
  return importParams.match(/['"]([^'"]+)['"]/)[1];
}

async function addFileImportsToGraph(currentFile, importPath, graph, sign, paths) {
  const currentFilePath = currentFile.source.input.file;
  const currentDirectory = path.dirname(currentFilePath);
  const filePath = await resolveFile(currentDirectory, importPath, paths);

  graph.setEdge(filePath, currentFilePath);

  const cssFile = await fs.readFile(filePath);
  return postcss([CssGraphCachePlugin({graph, sign, cssFile, paths})]).process(cssFile, {from: filePath})
}

const CssGraphCachePlugin = postcss.plugin('graph-cache', (options) => {
  return async (css, result) => {
    const { graph, sign, paths, cssFile } = options;
    const waitingList = [];

    graph.setNode(css.source.input.file, sign(cssFile));
    css.walkAtRules('import', atRule => waitingList.push(
      addFileImportsToGraph(css, extractPathFromImport(atRule.params), graph, sign, paths))
    );
    return Promise.all(waitingList);
  }
});

function createGraphFromFile(cssFile, sign, opts) {
  const graph = new Graph({ directed: true });
  return postcss([CssGraphCachePlugin({graph, sign, paths: opts.paths, cssFile})])
    .process(cssFile, {from: opts.filename})
    .then(() => graph);
}


module.exports = {
  createGraphFromFile,
};
