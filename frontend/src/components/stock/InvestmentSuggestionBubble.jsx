import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { RiArrowRightLine } from 'react-icons/ri';
import predictionYes from '../../assets/prediction_yes.svg';
import predictionNo from '../../assets/prediction_no.svg';
import predictionMaybe from '../../assets/prediction_maybe.svg';
import NumberField from '../base-ui/NumberField';

const formatVND = (val) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(val);

export default function InvestmentSuggestionBubble({ stockData, forecast, isLoading }) {
  const [capital, setCapital] = useState(1000000000); // Mặc định 1 Tỷ VND

  const suggestion = useMemo(() => {
    if (!forecast || !forecast.predictions || forecast.predictions.length === 0 || !stockData) return null;

    // Sử dụng giá đóng cửa gần nhất từ API history làm source of truth
    const history = forecast.history || [];
    const currentPrice = history.length > 0 ? history[history.length - 1].close : stockData.price;
    const currentDate =
      history.length > 0 ? dayjs(history[history.length - 1].date).format('DD/MM/YYYY') : dayjs().format('DD/MM/YYYY');

    // Tìm mức giá dự đoán cao nhất hoặc thấp nhất trong tương lai để đưa ra khuyến nghị
    let maxPrediction = forecast.predictions[0];
    let maxPrice = maxPrediction.quantiles['0.5'];

    for (const p of forecast.predictions) {
      if (p.quantiles['0.5'] > maxPrice) {
        maxPrice = p.quantiles['0.5'];
        maxPrediction = p;
      }
    }

    const predictedPrice = maxPrediction.quantiles['0.5'];

    // So sánh với giá hiện tại
    const isProfit = predictedPrice > currentPrice;
    const profitRatio = (predictedPrice - currentPrice) / currentPrice;
    const expectedProfit = capital * profitRatio; // Có thể âm
    const finalCapital = capital + expectedProfit;

    const targetDate = dayjs(maxPrediction.date).format('DD/MM/YYYY');

    let type = 'neutral';
    let asset = predictionMaybe;
    if (profitRatio > 0.02) {
      type = 'positive';
      asset = predictionYes;
    } else if (profitRatio < -0.02) {
      type = 'negative';
      asset = predictionNo;
    }

    return {
      isProfit,
      expectedProfit,
      finalCapital,
      currentDate,
      targetDate,
      type,
      asset: typeof asset === 'object' && asset.src ? asset.src : asset,
      profitRatio: profitRatio * 100,
    };
  }, [forecast, stockData, capital]);

  if (isLoading) {
    return (
      <div className="mb-6 flex flex-col md:flex-row gap-4 md:gap-6 items-end animate-pulse">
        {/* Skeleton Speech Bubble */}
        <div className="relative flex-1 bg-white dark:bg-grey-900 p-5 md:p-6 rounded-sm w-full drop-shadow-sm">
          {/* Skeleton Tail */}
          <div className="hidden md:block absolute bottom-6 -right-[8px] w-4 h-4 bg-white dark:bg-grey-900 transform rotate-45 -translate-y-1/2"></div>
          <div className="block md:hidden absolute -bottom-[8px] right-12 w-4 h-4 bg-white dark:bg-grey-900 transform rotate-45"></div>

          <div className="space-y-4">
            <div className="w-24 h-4 bg-grey-200 dark:bg-grey-800 rounded-sm"></div>

            <div className="space-y-2">
              <div className="w-full h-4 bg-grey-200 dark:bg-grey-800 rounded-sm"></div>
              <div className="w-2/3 h-4 bg-grey-200 dark:bg-grey-800 rounded-sm"></div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:justify-center gap-6 pt-2 w-full">
              <div className="w-full md:flex-1 md:max-w-[280px]">
                <div className="w-full h-[52px] bg-grey-200 dark:bg-grey-800 rounded-sm"></div>
              </div>

              <div className="hidden md:block">
                <div className="w-6 h-6 bg-grey-200 dark:bg-grey-800 rounded-sm"></div>
              </div>
              <div className="flex md:hidden self-center">
                <div className="w-6 h-6 bg-grey-200 dark:bg-grey-800 rounded-sm"></div>
              </div>

              <div className="">
                <div className="flex flex-col items-center md:items-start gap-2">
                  <div className="w-32 h-8 bg-grey-200 dark:bg-grey-800 rounded-sm"></div>
                  <div className="w-24 h-4 bg-grey-200 dark:bg-grey-800 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Character Image */}
        <div className="w-28 h-28 shrink-0 bg-grey-200 dark:bg-grey-800 rounded-sm self-end opacity-50"></div>
      </div>
    );
  }

  if (!suggestion) return null;

  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4 md:gap-6 items-end">
      {/* Speech Bubble */}
      <div className="relative flex-1 bg-white dark:bg-grey-900 p-5 md:p-6 rounded-sm w-full drop-shadow-sm">
        {/* Tail (Desktop: points right to the image) */}
        <div className="hidden md:block absolute bottom-6 -right-[8px] w-4 h-4 bg-white dark:bg-grey-900 transform rotate-45 -translate-y-1/2"></div>
        {/* Tail (Mobile: points down to the image) */}
        <div className="block md:hidden absolute -bottom-[8px] right-12 w-4 h-4 bg-white dark:bg-grey-900 transform rotate-45"></div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary-500">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Mách Nước</span>
          </div>

          <p className="text-sm text-grey-700 dark:text-grey-300 leading-relaxed">
            {suggestion.type === 'positive' ? (
              <>
                Hê lô! Nếu bạn "xuống tiền"{' '}
                <span className="font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {formatVND(capital)}
                </span>{' '}
                vào ngày{' '}
                <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {suggestion.currentDate}
                </span>
                , mình tin rằng đến ngày{' '}
                <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {suggestion.targetDate}
                </span>{' '}
                tài khoản của bạn sẽ{' '}
                <span className="text-emerald-500 dark:text-emerald-400">"nở hoa" rực rỡ thế này đây</span>:
              </>
            ) : suggestion.type === 'negative' ? (
              <>
                Cẩn thận nha! Rót{' '}
                <span className="font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {formatVND(capital)}
                </span>{' '}
                vào ngày{' '}
                <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {suggestion.currentDate}
                </span>{' '}
                thì đến ngày{' '}
                <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {suggestion.targetDate}
                </span>{' '}
                dễ{' '}
                <span className="text-red-500 dark:text-red-400">gặp sóng gió và đối mặt với khoản giảm này lắm á</span>
                :
              </>
            ) : (
              <>
                Hmm... Đầu tư{' '}
                <span className="font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {formatVND(capital)}
                </span>{' '}
                từ ngày{' '}
                <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {suggestion.currentDate}
                </span>{' '}
                đến ngày{' '}
                <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {suggestion.targetDate}
                </span>{' '}
                có vẻ{' '}
                <span className="text-amber-500 dark:text-amber-400">khá êm đềm, biến động không đáng kể đâu nè</span>:
              </>
            )}
          </p>

          <div className="flex flex-col md:flex-row items-center md:justify-center gap-6 pt-2 w-full">
            <div className="w-full md:flex-1 md:max-w-[280px]">
              <NumberField
                value={capital}
                onValueChange={(val) => {
                  if (val != null) setCapital(val);
                }}
                min={10000000}
                max={5000000000}
                step={10000000}
                suffix="₫"
                format={{
                  maximumFractionDigits: 0,
                }}
              />
            </div>

            <div className="text-grey-300 dark:text-grey-600 hidden md:block">
              <RiArrowRightLine size={24} />
            </div>
            <div className="flex md:hidden text-grey-300 dark:text-grey-600 rotate-90 self-center">
              <RiArrowRightLine size={24} />
            </div>

            <div className="">
              <div className="flex flex-col items-center md:items-start gap-1">
                <div
                  className={`font-mono font-medium text-2xl leading-none ${suggestion.type === 'positive' ? 'text-emerald-500' : suggestion.type === 'negative' ? 'text-red-500' : 'text-yellow-500'}`}
                >
                  {formatVND(suggestion.finalCapital)}
                </div>
                <div
                  className={`text-sm font-medium font-mono ${suggestion.type === 'positive' ? 'text-emerald-500' : suggestion.type === 'negative' ? 'text-red-500' : 'text-yellow-500'}`}
                >
                  {suggestion.isProfit ? '+' : ''}
                  {formatVND(suggestion.expectedProfit)} ({suggestion.profitRatio > 0 ? '+' : ''}
                  {suggestion.profitRatio.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Character Image */}
      <div className="w-32 h-32 shrink-0 flex items-center justify-center opacity-90 self-end md:mt-0 -mt-4 ml-0 md:-ml-4">
        <img src={suggestion.asset} alt="AI Prediction" className="w-full h-full object-contain" />
      </div>
    </div>
  );
}
