import { Injectable, Logger } from '@nestjs/common';

interface GraphData {
  date: string;
  [key: string]: number | string;
}

@Injectable()
export class LandingAnalyticsHelperService {
  private readonly logger = new Logger(LandingAnalyticsHelperService.name);

  constructor() {}

  getPreviousDates(startDate: string, endDate: string) {
    // Determine the number of days in the current date range
    const dateDifference =
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 3600 * 24) +
      1;

    // Calculate the previous date range
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - dateDifference);
    const previousEndDate = new Date(startDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);

    return { previousStartDate, previousEndDate };
  }

  groupAndSumProperty(
    data: GraphData[],
    property: 'users' | 'views',
  ): { date: string; [key: string]: number | string }[] {
    return data.reduce(
      (acc, cur) => {
        const found = acc.find((item) => item.date === cur.date);
        if (found) {
          found[property] =
            (found[property] as number) + (cur[property] as number);
        } else {
          acc.push({ date: cur.date, [property]: cur[property] });
        }
        return acc;
      },
      [] as { date: string; [key: string]: number | string }[],
    );
  }
}
