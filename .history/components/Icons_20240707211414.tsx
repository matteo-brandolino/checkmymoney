import {
  CirclePlus,
  LayoutDashboard,
  LucideIcon,
  Check,
} from "lucide-react-native";
import { cssInterop } from "nativewind";

function interopIcon(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}

interopIcon(CirclePlus);
interopIcon(Check);
interopIcon(LayoutDashboard);

export { CirclePlus, Check, LayoutDashboard };
