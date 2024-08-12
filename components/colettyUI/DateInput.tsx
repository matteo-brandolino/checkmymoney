import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { TextInputProps, View } from "react-native";
import DefaultInput from "./DefaultInput";

type SetDateType = (value: string, index?: number, field?: string) => void;

//todo refactor make simpler
interface DateInputProps extends TextInputProps {
  date: string;
  setDate: SetDateType;
  keyD?: string;
  index?: number;
}
export default function DateInput({
  date,
  setDate,
  keyD,
  index,
  ...props
}: DateInputProps) {
  const [show, setShow] = useState(false);
  const showDatepicker = () => {
    setShow(true);
  };
  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      if (index !== undefined && keyD !== undefined) {
        setDate(selectedDate.toISOString().split("T")[0], index, keyD);
      } else {
        setDate(selectedDate.toISOString().split("T")[0]);
      }
    }
  };
  return (
    <View>
      <DefaultInput
        {...props}
        showSoftInputOnFocus={false}
        caretHidden={true}
        onPress={showDatepicker}
        value={date}
      />
      {show && (
        <RNDateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          mode="date"
          display="spinner"
          onChange={onChange}
        />
      )}
    </View>
  );
}
