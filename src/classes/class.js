const data = require("./schedule");
class Schedule {
  constructor() {
    this.schedule = data;
  }

  toMinutes = (timeInHours) => {
    let inMinutes = [];
    for (let i = 0; i < timeInHours.length; i++) {
      let start = timeInHours[i].split("-")[0];
      let end = timeInHours[i].split("-")[1];
      inMinutes.push([
        parseInt(start.split(":")[0]) * 60 + parseInt(start.split(":")[1]),
        parseInt(end.split(":")[0]) * 60 + parseInt(end.split(":")[1]),
      ]);
    }
    return inMinutes;
  };

  findInRange = (range, toFind) => {
    let index = null
    for(let i=0;i<range.length;i++){
        if(toFind >= range[i][0] && toFind <= range[i][1]){
            index = i;
        }
    }
    return index;
  };

  classNow = () => {
    let now = new Date();
    let classes_today = this.schedule[now.getDay()];
    let inHours = Object.keys(classes_today);
    let inMinutes = this.toMinutes(inHours);
    let class_index = this.findInRange(inMinutes, now.getHours() * 60 + now.getMinutes());

    let result = {};

    if(class_index >= 0){
        Object.assign(result,classes_today[inHours[class_index]]);
    } 

    return result;
  };

  findNextInRange = (range, toFind) => {
    for (let i = 0; i < range.length; i++) {
      if (toFind < range[i][0]) {
        return i;
      }
    }
  
    return null;
  };

  classNext = () => {
    const now = new Date();
    const classes_today = this.schedule[now.getDay()];
    const inHours = Object.keys(classes_today);
    const inMinutes = this.toMinutes(inHours);
    const class_index = this.findNextInRange(
      inMinutes,
      now.getHours() * 60 + now.getMinutes()
    );
  
    let result = {};
  
    if (class_index >= 0) {
      Object.assign(result, classes_today[inHours[class_index]]);
    }
  
    return result;
  };
}

module.exports = Schedule;
