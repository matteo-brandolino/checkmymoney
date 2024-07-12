import {
  CirclePlus,
  DoorOpenIcon,
  DoorClosedIcon,
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
interopIcon(DoorOpenIcon);
interopIcon(DoorClosedIcon);

export { CirclePlus, Check, DoorOpenIcon, DoorClosedIcon };
