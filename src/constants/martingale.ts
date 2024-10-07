import { CreateMartingale2Dto } from "../modules/martingale-2/dtos/create-martingale-2.dto";
import { CreateMartingale1Dto } from "../modules/martingale-1/dtos/create-martingale-1.dto";
import { StrategyType } from "./strategy-type";
import { MartingaleEnterType } from "./martingale-enter-type";
import { CreateMartingale3Dto } from "../modules/martingale-3/dtos/create-martingale-3.dto";

export const martingale1 = (subAccId: Uuid): CreateMartingale1Dto => {
  return {
    strategyType: StrategyType.martingale_1,
    marginMode: "cross",
    category: "linear",
    symbol: "BTCUSDT",
    initialCapital: 100,
    minCapital: 100,
    maxCapital: 100,
    leverage: 100,
    isLoop: true,
    bybitSubAccId: subAccId,
    enterBy: "percentage",
    orderBy: "qty",
    // entriesDifferences: 3,
    activationPercentage: 0.001,
    retracementPercentage: 0.001,
    shortEntry: [null, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003],
    shortOrder: [0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005],
    longEntry: [null, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003],
    longOrder: [0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005],
  }
}

export const martingale2 = (subAccId: Uuid): CreateMartingale2Dto => {
  return {
    strategyType: StrategyType.martingale_2,
    marginMode: "cross",
    category: "linear",
    symbol: "BTCUSDT",
    initialCapital: 100,
    minCapital: 100,
    maxCapital: 100,
    leverage: 100,
    isLoop: true,
    bybitSubAccId: subAccId,
    enterBy: MartingaleEnterType.percentage,
    orderBy: "qty",
    entriesDifferences: 3,
    activationPercentage: 0.001,
    retracementPercentage: 0.001,
    shortEntry: [null, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003],
    shortOrder: [0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005],
    longEntry: [null, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003],
    longOrder: [0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005],
  }
}

export const martingale3 = (subAccId: Uuid): CreateMartingale3Dto => {
  return {
    strategyType: StrategyType.martingale_3,
    marginMode: "cross",
    category: "linear",
    symbol: "BTCUSDT",
    initialCapital: 100,
    minCapital: 100,
    maxCapital: 100,
    leverage: 100,
    isLoop: true,
    bybitSubAccId: subAccId,
    orderBy: "qty",
    orders: [0.001, 0.001],
    takeProfitPercentage: 0.001,
    throttlePercentage: 0.001,
  }
}
