import {
  CirclePlus,
  DoorOpenIcon,
  DoorClosedIcon,
  PackageIcon,
  PackageOpenIcon,
  LucideIcon,
  Check,
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  SheetIcon,
  XIcon,
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
interopIcon(ArrowDownIcon);
interopIcon(ArrowUpIcon);
interopIcon(ArrowRightIcon);
interopIcon(SheetIcon);
interopIcon(XIcon);

export {
  CirclePlus,
  Check,
  DoorOpenIcon,
  DoorClosedIcon,
  PackageIcon,
  PackageOpenIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  SheetIcon,
  XIcon,
};
