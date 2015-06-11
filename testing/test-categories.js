///* I wrote some auto magical code that needs to be tested. */
//// TODO init a course
//var course = new Course(/*...*/)
//
//// TODO Test property accessors that proxy course.get(key)
///* For example, course.categories proxies course.get(‘categories’) */
//course.categories === course.get(‘categories’) /* Therefore this should always be true. */
//
//// TODO Test property accessors that proxy course.get(key) and course.set(key)
///* For example, course.aMin proxies course.get(‘key’) and course.set(‘aMin’, value) */
//var b = false
//course.once(‘change:aMin’, function(model, value, options) {
//   b = true /* Note this assignment */});
//
//course.aMin === course.get(‘aMin’) /* This should always be true. */
//course.aMin = 85
//b === true /* This should be true as b is assigned to true in the event listener */
//course.get(‘aMin’) === 85 /* This should be true */
//course.aMin === course.get(‘aMin’) /* This should still be true */
//
//// TODO Test the course.categories.tree property
///* To understand how to test this you must understand the following */
///* that course.categories is an instance of Backbone.Collection. */
///* This collection holds Backbone.Model instances with a string called path (among others). */
///* The path string is like a file path for assignments and its path separator is ‘#’ */
///* For example, a course.categories instance converted to JSON might read: */
//[{
//    "name": "Coursework",
//    "path": "#Coursework",
//    "_id": "55642e5e3fb209233547b669",
//    "assignments": [],
//    "weight": 1
//}, {
//    "name": "Classwork",
//    "path": "#Coursework#Classwork",
//    "_id": "55642e5e3fb209233547b664",
//    "assignments": [],
//    "weight": 1
//}, {
//    "name": "Homework",
//    "path": "#Coursework#Homework",
//    "_id": "55642e5e3fb209233547b65e",
//    "assignments": [],
//    "weight": 1
//}, {
//    "name": "Labs",
//    "path": "#Labs",
//    "_id": "55642e5e3fb209233547b657",
//    "assignments": [],
//    "weight": 1
//}]
///* Given these paths, there are two top level categories: Coursework and Labs/ */
///* The remaining two categories (Classwork and Homework) are subcategories of Coursework. */
//
///* The property, course.categories.tree, references a special Backbone.Collection instance. */
///* This collection always holds the top level categories from course.categories, like Coursework and Labs from the example above. */
///* This collection automatically updates when course.categories changes. */
///* Anytime you add a top level category to course.courses, you also add said category to course.categories.tree: */
//
//var b1 = false;
//var ref1 = null;
//course.categories.once(‘add’, function(model, collection, options) {
//   /* Note these assignment statements */
//   b1 = true
//   ref1 = model
//});
//
//var b2 = false;
//var ref2 = null
//course.categories.tree.once(‘add’, function(model, collection, options) {
//   /* Note these assignment statements */
//   b2 = true
//   ref2 = model
//});
//
//var numCategoriesBefore = course.categories.models.length
//var numTopLevelCategoriesBefore = course.categories.tree.models.length
//course.categories.push({
//    "name": "Projects",
//    "path": "#Projects",
//    "assignments": [],
//    "weight": 1
//})
//var numCategoriesAfter = course.categories.models.length
//var numTopLevelCategoriesAfter = course.categories.tree.models.length
//
//
//b1 === true && b2 === true /* this should be true, meaning both events were triggered */
//ref1 !== null && ref1.get(‘path’) === ‘#Projects’ && ref1 === ref2 /* this should be true because course.categories.tree should reference as subset of the models in course.categories */
//(numCategoriesAfter – numCategoriesBefore) === (numTopLevelCategoriesAfter - numTopLevelCategoriesBefore) === 1 /* the size of each collection should have grown by one */
//
///* Anytime you move a top-level category in course.categories into another category you automatically remove it from course.categories.tree: */
//
//course.categories.reset();
//course.categories.push({
//    "name": "Exams",
//    "path": "#Exams",
//    "assignments": [],
//    "weight": 1
//})
//course.categories.push({
//    "name": "Tests",
//    "path": "#Tests",
//    "assignments": [],
//    "weight": 1
//})
//course.categories.models.length === 2 /* make sure setup for test worked */
//
//var treeIsSubsetCategories = course.categories.tree.every(function(cat) {
//   return course.categories.contains(cat)
//});
//var categoriesIsSubsetTree = course.categories.every(function(cat) {
//   return course.categories.tree.contains(cat)
//});
//treeIsSubsetCategories === categoriesIsSubsetTree === true /* both collections should be the same */
//
//var exams = course.categories.at(0);
//var tests = course.categories.at(1);
//
///* Make Tests a subcategory of Exams */
//var pathValue = exams.get(‘path’).concat(tests.get(‘path’));
//tests.set(‘path’, pathValue);
//
///* Make sure tree only holds exams */
//var treeOnlyHoldsExams = course.categories.tree.every(function(cat) {
//   return cat === exams
//});
//treeOnlyHoldsExams === true
//
///* Make sure categories hasn’t changed */
//course.categories.contains(exams) === course.categories.contains(tests) === true
//
