import React, {FC} from 'react';
import {View, Text, TextInput} from 'react-native'
import {Controller} from "react-hook-form";
import { Paragraph } from '@/shared/ui/typography';
import { FontIcon } from '@/shared/ui/icon-wrapper/FontIcon';
import colors from '@/constants/colors';

type FormData = {
    control?: any
    errors?: any
    name: string
    placeholder: string
    title?: string
    type?: string
    className?: string
    rules?: any
    isDisabled?: boolean
    icon?: React.ReactNode
    iconFamily?: string
    iconName?: string
    iconSize?: number
    reverse?: boolean
}


const CustomInput: FC<FormData> = ({ className = '', type = 'input', isDisabled = false, reverse = false, ...props}: FormData) => {

    const renderIconElement = () => (
        <>
            { props.icon && props.icon }
            { props.iconFamily && props.iconName && <FontIcon iconFamily={props.iconFamily} iconName={props.iconName} size={16} color={colors.inputColor} /> }
        </>
    );

    const [isFocused, setIsFocused] = React.useState(false);

    const renderInput = ({ onChange, onBlur, value }: { onChange: any; onBlur: any; value: any }) => {
        return (
            <TextInput
                onChangeText={onChange}
                value={value}
                placeholder={props.placeholder}
                
                multiline={type === 'textarea'}
                numberOfLines={type === 'textarea' ? 4 : 1}

                onBlur={() => {
                    setIsFocused(false);
                    onBlur();
                }}

                onFocus={() => {
                    setIsFocused(true);
                }}

                style={type === 'textarea' && { textAlignVertical: 'top' }}
                placeholderTextColor={colors.inputPlaceholderColor}
                underlineColorAndroid='transparent'
                className='flex-1 py-1 px-2 text-inputColor'
                editable={!isDisabled}
                // {...rest} // add type=password
            />
        );
    };
    
    return (

        <>
            <Controller
                name={props.name}
                control={props.control}
                rules={props.rules}

                render={({ field: { onChange, onBlur, value } }) => (

                        <View className={`${className} mx-auto w-full max-w-max my-2 px-2`}>

                            {
                                props.title && 
                                <Text className="block text-xs text-sky-500 mb-1 -mt-1">
                                    {props.title}
                                </Text>
                            }

                            <View className={`flex-row justify-between border-0 border-b ${isFocused ? 'border-primary' : 'border-borderColor'} ${isDisabled && 'opacity-50'}`}>
                                
                            {reverse
                                ? <>
                                    {renderInput({ onChange, onBlur, value })}
                                    {renderIconElement()}
                                </>
                                : <>
                                    {renderIconElement()}
                                    {renderInput({ onChange, onBlur, value })}
                                </>
                            }
                                
                            </View>


                        </View>

                    )}
            />
            { props.errors && props.errors[props.name] && <Paragraph className='text-red-400'>{props.errors[props.name].message}</Paragraph>}
        </>
    )
}

export default CustomInput