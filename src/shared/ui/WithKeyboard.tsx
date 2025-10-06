import { FC } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

interface WithKeyboardProps {
  marginTop?: number;
  backgroundColor?: string;
  paddingBottom?: number;
  children: React.ReactNode;
}

const WithKeyboard: FC<WithKeyboardProps> = ({
  children,
}) => {
  return (
    
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1}}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    
  );
};

export default WithKeyboard;
