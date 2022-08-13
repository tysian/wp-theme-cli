import chalk, { ChalkInstance } from 'chalk';
import { performance } from 'perf_hooks';

export type StatisticProp = {
  value: number;
  description: string;
  color?: ChalkInstance;
};

export type StatisticsCollection = Record<string, StatisticProp>;

export class Statistics {
  private startTime = 0;

  private timeElapsed = 0;

  constructor(private statistics: StatisticsCollection) {}

  startTimer() {
    this.startTime = performance.now();
  }

  stopTimer() {
    if (this.startTime <= 0) {
      throw new Error('You need to start your timer first');
    }

    this.timeElapsed = performance.now() - this.startTime;
  }

  getFormattedTimer() {
    if (this.timeElapsed <= 0) {
      throw new Error('You need to start and stop your timer properly.');
    }
    return `${this.timeElapsed.toFixed(3)}ms`;
  }

  incrementStat(type: keyof typeof this.statistics, amount = 1) {
    this.statistics[type].value += amount;
  }

  getStat(type: keyof typeof this.statistics) {
    return this.statistics[type];
  }

  getFormattedStats() {
    const formattedStats = Object.values(this.statistics).map((props) => {
      const finalText = [];
      if (props.description.trim()) {
        finalText.push(`${props.description}:`);
      }
      const color = props?.color ?? chalk.blue;
      finalText.push(color(props.value));
      return finalText.join(' ').trim();
    });
    if (this.timeElapsed) {
      formattedStats.push(`Time elapsed: ${this.getFormattedTimer()}`);
    }

    return formattedStats.filter((s) => String(s).length).join('\n');
  }
}
