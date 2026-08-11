/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-05 09:13:12
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-03 17:24:59
 * @Description: 日期时间
 */
import { Description } from '@heroui/react'
import NumberFlow, { NumberFlowGroup } from '@number-flow/react'
import dayjs from 'dayjs'
import { Lunar } from 'lunar-typescript'
import { memo, useEffect, useState } from 'react'

import type { FC } from 'react'

const TimeAndLunar: FC = memo(() => {
  const [now, setNow] = useState(() => new Date())
  const [lunar, setLunar] = useState('')

  useEffect(() => {
    let lastDate = ''
    let lastSeconds = -1

    const update = () => {
      const current = new Date()
      // 时钟只显示到秒：秒未变化时跳过 setState，避免 60fps 无意义重渲染
      if (current.getSeconds() !== lastSeconds) {
        lastSeconds = current.getSeconds()
        setNow(current)
      }

      const dateStr = dayjs(current).format('YYYY-MM-DD')
      if (dateStr !== lastDate) {
        lastDate = dateStr

        const l = Lunar.fromDate(current)
        setLunar(
          `${l.getYearInGanZhi()}年 ${l.getMonthInGanZhi()}月 ${l.getDayInGanZhi()}日 ${l.getMonthInChinese()}月${l.getDayInChinese()} 星期${l.getWeekInChinese()}`,
        )
      }
    }

    // 250ms 轮询：秒跳变后及时更新，同时避免每帧触发
    update()
    const id = window.setInterval(update, 250)
    return () => window.clearInterval(id)
  }, [])

  const d = now

  return (
    <div className="justify-self-center hidden sm:flex flex-col gap-1 text-center">
      {/* 数字流时间 */}
      <NumberFlowGroup>
        <div className="flex items-center justify-center text-sm">
          <NumberFlow format={{ useGrouping: false }} value={d.getFullYear()} />
          <NumberFlow format={{ minimumIntegerDigits: 2 }} prefix="-" value={d.getMonth() + 1} />
          <NumberFlow format={{ minimumIntegerDigits: 2 }} prefix="-" value={d.getDate()} />
          <span className="mx-1"> </span>
          <NumberFlow format={{ minimumIntegerDigits: 2 }} value={d.getHours()} />
          <NumberFlow format={{ minimumIntegerDigits: 2 }} prefix=":" value={d.getMinutes()} />
          <NumberFlow format={{ minimumIntegerDigits: 2 }} prefix=":" value={d.getSeconds()} />
        </div>
      </NumberFlowGroup>
      {/* 农历 */}
      <Description>{lunar || '加载农历中...'}</Description>
    </div>
  )
})

export default TimeAndLunar
