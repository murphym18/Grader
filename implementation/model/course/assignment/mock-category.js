var pathSeparator = "#";

module.exports = function generateMockCategory(name, parentPath) {
    var path = parentPath + pathSeparator + name;

    return {
        name: name,
        weight: 1,
        assignments: [],
        path: path
    };
}