import { RNPackageContext, RNPackage } from '@rnoh/react-native-openharmony/ts';
import { GestureHandlerPackage } from '@react-native-oh-tpl/react-native-gesture-handler';
import {SafeAreaViewPackage} from '@react-native-oh-tpl/react-native-safe-area-context/ts';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    new GestureHandlerPackage(ctx),
    new SafeAreaViewPackage(ctx)
  ];
}