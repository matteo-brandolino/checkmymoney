import DefaultInput from "@/components/colettyUI/DefaultInput";
import { Label } from "@/components/ui/label";
import { TemplateLocalState } from "@/types";
import { CirclePlus } from "lucide-react-native";
import React, { useRef } from "react";
import { ScrollView, View } from "react-native";

type AdditionalFieldsProps = {
  localState: TemplateLocalState;
  setLocalState: React.Dispatch<React.SetStateAction<TemplateLocalState>>;
  color: string;
};

export default function AdditionalFields({
  localState,
  setLocalState,
  color,
}: AdditionalFieldsProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  const onChangeKeys = async (value: string, id: number) => {
    console.info("Try to change key with: ", value, id, localState);

    const data = localState.data.map((k) => (k.id === id ? { id, value } : k));

    console.info("onChangeKeyes: ", data);

    setLocalState({ ...localState, data });
  };

  const onAddNewKey = async () => {
    const data = [...localState.data, { id: new Date().getTime(), value: "" }];
    console.info(data);
    setLocalState({ ...localState, data });
  };

  function scrollViewSizeChanged(height: number) {
    // y since we want to scroll vertically, use x and the width-value if you want to scroll horizontally
    scrollViewRef &&
      scrollViewRef.current?.scrollTo({ y: height, animated: true });
  }
  return (
    <>
      <Label nativeID="additionalFields" className="pb-3.5">
        Additional Fields
      </Label>
      <ScrollView
        ref={scrollViewRef}
        className="mb-8"
        onContentSizeChange={(_, height) => {
          scrollViewSizeChanged(height);
        }}
      >
        {localState &&
          localState.data &&
          localState.data.map((k) => (
            <View className="my-2" key={k.id}>
              <DefaultInput
                placeholder="Write some stuff..."
                value={k.value}
                onChangeText={(value) => onChangeKeys(value, k.id)}
                aria-labelledbyledBy="inputLabel"
                aria-errormessage="inputError"
              />
            </View>
          ))}
        <View className="my-2 flex flex-row justify-end">
          <CirclePlus onPress={onAddNewKey} color={color} size={32} />
        </View>
      </ScrollView>
    </>
  );
}
