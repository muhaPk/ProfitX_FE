import React from "react";
import {
  SafeAreaView as NativeSafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { cssInterop } from "nativewind";
import { cn } from "@/utils/cn";

// Enable NativeWind className support for SafeAreaView
cssInterop(NativeSafeAreaView, { className: "style" });

interface CustomSafeAreaViewProps extends SafeAreaViewProps {
  className?: string;
  withKeyboardAvoiding?: boolean; // toggle for forms
  scrollable?: boolean; // toggle if you need ScrollView
  children: React.ReactNode;
}

export const SafeAreaView = React.forwardRef<any, CustomSafeAreaViewProps>(
  (
    {
      className = "",
      withKeyboardAvoiding = false,
      scrollable = false,
      children,
      ...props
    },
    ref
  ) => {

    const content = scrollable ? (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {children}
      </ScrollView>
    ) : (
      children
    );

    const wrapped = withKeyboardAvoiding ? (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {content}
      </KeyboardAvoidingView>
    ) : (
      content
    );

    return (
      <NativeSafeAreaView 
        ref={ref} 
        className={cn("flex-1 px-4 bg-bgBody", className)} 
        {...props}
      >
        {wrapped}
      </NativeSafeAreaView>
    );
  }
);

SafeAreaView.displayName = "SafeAreaView";
