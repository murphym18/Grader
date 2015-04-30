module.exports = {
   creditNoCredit: {
      minCredit: {
         type: Number,
         min: 0,
         max: 100,
         default: 60,
         select: true,
         required: true
      }
   },
   letterGrade: {
      minA: {
         type: Number,
         min: 0,
         max: 100,
         default: 90,
         required: true,
         select: true
      },
      minB: {
         type: Number,
         min: 0,
         max: 100,
         default: 80,
         required: true,
         select: true
      },
      minC: {
         type: Number,
         min: 0,
         max: 100,
         default: 70,
         required: true,
         select: true
      },
      minD: {
         type: Number,
         min: 0,
         max: 100,
         default: 60,
         required: true,
         select: true
      }
   },
   preSave: function (next) {
      if (this.minB > this.minA) {
         next('Invalid minimum score for B. The score must not be larger than A.');
      }
      else if (this.minC > this.minB) {
         next('Invalid minimum score for C. The score must not be larger than B.');
      }
      else if (this.minD > this.minC) {
         next('Invalid minimum score for D. The score must not be larger than C.');
      }
      else {
         next();
      }
   }
};