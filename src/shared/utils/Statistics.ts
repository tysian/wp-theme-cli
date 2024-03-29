import { performance } from 'perf_hooks';
import chalk, { ChalkInstance } from 'chalk';
import { asArray } from './asArray.js';

export type StatisticProp = {
  value: number;
  description: string;
  files?: string[];
  color?: ChalkInstance;
};

export type StatisticsCollection<K extends string = string> = Record<K, StatisticProp>;

export class Statistics<T extends StatisticsCollection> {
  private startTime = 0;

  private timeElapsed = 0;

  constructor(private statistics: T) {}

  startTimer(): void {
    this.startTime = performance.now();
  }

  stopTimer(): void {
    if (this.startTime <= 0) {
      throw new Error('You need to start your timer first');
    }

    this.timeElapsed = performance.now() - this.startTime;
  }

  getFormattedTimer(): string {
    if (this.timeElapsed <= 0) {
      throw new Error('You need to start and stop your timer properly.');
    }
    return `${this.timeElapsed.toFixed(3)}ms`;
  }

  addFile(type: keyof typeof this.statistics, filePath: string): boolean {
    const root = this.getStat(type);
    root.files = root?.files ? asArray(root.files) : [];

    const alreadyProcessed = root.files.includes(filePath);
    if (!alreadyProcessed) {
      root.files.push(filePath);
    }

    return alreadyProcessed;
  }

  /**
   * @deprecated Use {@link addFile} instead
   */
  incrementStat(type: keyof typeof this.statistics, amount = 1): void {
    this.statistics[type].value += amount;
  }

  getAllStats(): typeof this.statistics {
    return this.statistics;
  }

  getStat(type: keyof typeof this.statistics): StatisticProp {
    return this.statistics[type];
  }

  getFormattedStats(): string {
    const formattedStats = Object.values(this.statistics).map((props) => {
      const finalText = [];
      if (props.description.trim()) {
        finalText.push(`${props.description}:`);
      }
      const value = (props?.files ?? []).length;
      const color = props?.color ?? chalk.blue;
      finalText.push(color(value));
      return finalText.join(' ').trim();
    });
    if (this.timeElapsed) {
      formattedStats.push(`Time elapsed: ${this.getFormattedTimer()}`);
    }

    return formattedStats.filter((s) => String(s).length).join('\n');
  }
}
