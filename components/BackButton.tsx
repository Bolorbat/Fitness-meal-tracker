import { router } from "expo-router"
import { SkipBackIcon } from "phosphor-react-native"
import { Pressable } from "react-native"

export const BackButton = () =>
{
    return(
        <Pressable onPress={() => router.back()}
        className="justify-center items-center px-3">
            <SkipBackIcon size={20} weight="bold" color="black"/>
        </Pressable>
    )
}