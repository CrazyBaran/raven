export class ExecutionTimeHelper {
  public static logJobs = {};
  public static startTime(jobName: string, subjob = ''): void {
    if (!subjob) {
      ExecutionTimeHelper.logJobs[jobName] = {
        startTime: process.uptime(),
        endTime: process.uptime(),
        executionTime: ExecutionTimeHelper.logJobs[jobName]?.executionTime || 0,
        subJobs: {},
      };
    } else {
      ExecutionTimeHelper.logJobs[jobName].subJobs[subjob] = {
        startTime: process.uptime(),
        endTime: process.uptime(),
        executionTime:
          ExecutionTimeHelper.logJobs[jobName].subJobs[subjob]?.executionTime ||
          0,
      };
    }
  }
  public static endTime(jobName: string, subjob = ''): void {
    if (!subjob) {
      ExecutionTimeHelper.logJobs[jobName].endTime = process.uptime();
      ExecutionTimeHelper.logJobs[jobName].executionTime +=
        ExecutionTimeHelper.logJobs[jobName].endTime -
        ExecutionTimeHelper.logJobs[jobName].startTime;
    } else {
      ExecutionTimeHelper.logJobs[jobName].subJobs[subjob].endTime =
        process.uptime();
      ExecutionTimeHelper.logJobs[jobName].subJobs[subjob].executionTime +=
        ExecutionTimeHelper.logJobs[jobName].subJobs[subjob].endTime -
        ExecutionTimeHelper.logJobs[jobName].subJobs[subjob].startTime;
    }
  }

  public static printTime(jobName: string): void {
    console.log(
      `[${
        ExecutionTimeHelper.name
      }] job ${jobName} took: (${ExecutionTimeHelper.logJobs[
        jobName
      ].executionTime.toFixed(8)})`,
    );
  }

  public static printFullLog(clear = true): void {
    let logs = `[${ExecutionTimeHelper.name}] Execution times:\n`;
    let totalTime = 0;
    for (const key of Object.keys(ExecutionTimeHelper.logJobs)) {
      logs += `${key}: (${ExecutionTimeHelper.logJobs[
        key
      ].executionTime.toFixed(8)})\n`;
      const subjobs = Object.keys(ExecutionTimeHelper.logJobs[key].subJobs);
      if (subjobs.length) {
        for (const skey of subjobs) {
          logs += `  - ${skey}: (${ExecutionTimeHelper.logJobs[key].subJobs[
            skey
          ].executionTime.toFixed(8)})\n`;
        }
      }
      totalTime += ExecutionTimeHelper.logJobs[key].executionTime;
    }
    logs += `TOTAL EXECUTION TIME: (${totalTime})`;
    console.log(logs);
    if (clear) {
      ExecutionTimeHelper.logJobs = {};
    }
  }
}
