import {
  CirclePlus,
  DoorOpenIcon,
  DoorClosedIcon,
  PackageIcon,
  PackageOpenIcon,
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
interopIcon(PackageIcon);
interopIcon(PackageOpenIcon);

export {
  CirclePlus,
  Check,
  DoorOpenIcon,
  DoorClosedIcon,
  PackageIcon,
  PackageOpenIcon,
};
