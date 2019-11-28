/**
 * 组件模板
 * 使用时修改 `Temp` 为对应的组件名
 */
import { View, ScrollView } from '@tarojs/components';
import classnames from 'classnames';

import './index.scss';

/**
 * 重要，这里的props需要准确定义，关乎到使用的入参提示等
 */
export interface LogProps {
  orientation: string;
  LogList: Array<String>;
}

export default function Temp(props: LogProps) {
  const { orientation, LogList = [] } = props
  return <ScrollView scrollY className={classnames(
    'log-wrapper', { 'horizontal': orientation === 'horizontal'}, { 'vertical': orientation === 'vertical'}
  )}>
    {
      LogList.map((log, index) => {
        return <View key={log + String(index)} className="text">{log}</View>
      })
    }
  </ScrollView>;
}

Temp.options = {
  addGlobalClass: true,
};
