type UsageTimeType = "year" | "month" | "week" | "day" | "hour";

function getUsageTimeDescription(
  daysUsed: number,
  forceType?: UsageTimeType,
  short: boolean = false
): {
  type: UsageTimeType;
  text: string;
} {
  const d = Math.floor(daysUsed);

  const format = (main: number, unit: string, sub?: number, subUnit?: string) => {
    if (short) {
      return `${main}${unit}${sub && sub > 0 ? ` ${sub}${subUnit}` : ""}`;
    } else {
      return `${main}${unit === "y" ? "年" : unit === "mo" ? "个月" : unit === "w" ? "周" : "天"}${
        sub && sub > 0 ? sub + (subUnit === "mo" ? "个月" : subUnit === "d" ? "天" : "") : ""
      }`;
    }
  };

  // 强制类型优先处理
  switch (forceType) {
    case "year": {
      const years = Math.floor(d / 365);
      const months = Math.floor((d % 365) / 30);
      return {
        type: "year",
        text: format(years, "y", months, "mo"),
      };
    }
    case "month": {
      const months = Math.floor(d / 30);
      const days = d % 30;
      return {
        type: "month",
        text: format(months, "mo", days, "d"),
      };
    }
    case "week": {
      const weeks = Math.floor(d / 7);
      const days = d % 7;
      return {
        type: "week",
        text: format(weeks, "w", days, "d"),
      };
    }
    case "day":
      return {
        type: "day",
        text: short ? `${d}d` : `${d}天`,
      };
    case "hour":
      return {
        type: "hour",
        text: short ? "<1d" : "<1天",
      };
  }

  // 默认推断类型
  if (d >= 365) {
    const years = Math.floor(d / 365);
    const months = Math.floor((d % 365) / 30);
    return {
      type: "year",
      text: format(years, "y", months, "mo"),
    };
  } else if (d >= 60) {
    const months = Math.floor(d / 30);
    const days = d % 30;
    return {
      type: "month",
      text: format(months, "mo", days, "d"),
    };
  } else if (d >= 14) {
    const weeks = Math.floor(d / 7);
    const days = d % 7;
    return {
      type: "week",
      text: format(weeks, "w", days, "d"),
    };
  } else if (d >= 1) {
    return {
      type: "day",
      text: short ? `${d}d` : `${d}天`,
    };
  } else {
    return {
      type: "hour",
      text: short ? "<1d" : "<1天",
    };
  }
}

export { getUsageTimeDescription, UsageTimeType };
