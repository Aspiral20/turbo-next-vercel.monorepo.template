import moment from 'moment';
import DurationConstructor = moment.unitOfTime.DurationConstructor;
import StartOf = moment.unitOfTime.StartOf;

export type MomentType = {
  add: {
    amount: string | number;
    unit: DurationConstructor;
    endOfUnit: StartOf;
  };
};
