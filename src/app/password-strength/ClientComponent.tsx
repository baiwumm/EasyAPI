'use client'
import { Chip, type ChipProps, Input, toast } from '@heroui/react';
import { type ZxcvbnResult } from '@zxcvbn-ts/core';
import { type FC, useState } from 'react';

import JsonContent, { type GetColumnsFn } from '@/components/JsonContent';

const ClientComponent: FC<App.ClientComponentProps> = ({ title }) => {
  const [password, setPassword] = useState('abc123456');

  // 请求数据
  const onRefresh = () => {
    if (!password?.trim()) {
      toast.danger("参数 password 必填");
      return false;
    }
    if (password.length > 128) {
      toast.danger("参数 password 长度不能超过 128 个字符");
      return false;
    }
    return true
  }

  const getColumns: GetColumnsFn<ZxcvbnResult> = (data) => {
    const {
      password,
      score,
      guesses,
      crackTimesDisplay,
      feedback,
    } = data || {};

    const scoreMap = ['非常弱', '弱', '一般', '强', '非常强'];

    const scoreColor: ChipProps['color'][] = [
      'danger',
      'danger',
      'warning',
      'warning',
      'success'
    ];

    return [
      { label: '密码', children: <Chip>{password || '--'}</Chip> },

      {
        label: '密码强度',
        children: <Chip variant="soft" color={scoreColor[score]}>{score !== undefined ? scoreMap[score] : '--'}</Chip>,
      },

      {
        label: '预计破解次数',
        children: guesses ? `${guesses.toLocaleString()} 次` : '--',
      },

      {
        label: '在线攻击破解时间',
        children: crackTimesDisplay?.onlineNoThrottling10PerSecond || '--',
      },

      {
        label: '离线攻击破解时间',
        children: crackTimesDisplay?.offlineFastHashing1e10PerSecond || '--',
      },

      {
        label: '安全提示',
        children: feedback?.warning || '未发现明显风险',
      },

      {
        label: '改进建议',
        children: feedback?.suggestions?.join('；') || '密码强度较好',
      },
    ];
  };
  return (
    <JsonContent title={title} searchText='检测' params={{ password }} onRefresh={onRefresh} getColumns={getColumns}>
      <Input value={password} onChange={(event) => setPassword(event.target.value)} aria-label="密码" placeholder='请输入密码' className="w-50" />
    </JsonContent>
  )
}
export default ClientComponent;