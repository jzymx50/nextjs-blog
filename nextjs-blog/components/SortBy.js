function sortByDate(jsonObj){
    const sortedArray = jsonObj.sort((a, b) => b.last_modified - a.last_modified);
    return sortedArray;
}

function sortByLike(jsonObj){
    const sortedArray = jsonObj.sort((a, b) => (b.publish.likes + b.publish.downloads) - (a.publish.likes + a.publish.downloads));
    return sortedArray;

}

/*
let jsonObj = [
    { "last_modified": new Date('2020-11-20'), "publish": {"likes": 100, "downloads": 100}},
    { "last_modified": new Date('2020-11-19'), "publish": {"likes": 1000, "downloads": 1000}},
    { "last_modified": new Date('2020-11-21'), "publish": {"likes": 10, "downloads": 10}}
 ];

console.log(sortByDate(jsonObj));
console.log(sortByLike(jsonObj));
*/