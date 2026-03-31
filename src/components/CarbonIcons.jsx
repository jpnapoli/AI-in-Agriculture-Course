/**
 * Carbon Design System Icons — Official @carbon/icons-react
 * All icons imported directly from the @carbon/icons-react package.
 * No custom SVG paths — every icon is the official Carbon Design System icon.
 *
 * @see https://carbondesignsystem.com/elements/icons/library/
 */
import React from 'react';

import {
  Dashboard,
  Information,
  Education,
  Certificate,
  Sun,
  Moon,
  Checkmark,
  CheckmarkFilled,
  CheckmarkOutline,
  Close,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  PlayFilled,
  Play,
  StopFilled,
  Time,
  Catalog,
  StarFilled,
  Star,
  Flag,
  Group,
  Sprout,
  Satellite,
  CropGrowth,
  Cloud,
  Delivery,
  Copy,
  Trophy,
  GameConsole,
  Quotes,
  Code,
  WarningAlt,
  Edit,
  Ai,
  Earth,
  Document,
  Search,
  Settings,
  Restart,
  Launch,
  Notification,
  Terminal,
  Idea,
  Microphone,
  MicrophoneOff,
  Send,
  VolumeUp,
  VolumeMute,
  Location,
  UserAvatar,
  Renew,
  AgricultureAnalytics,
  Chemistry,
  Laptop,
  Policy,
  InventoryManagement,
  Partnership,
  VideoChat,
  Bot,
} from '@carbon/icons-react';

/**
 * Wrapper that normalizes props for @carbon/icons-react.
 * Carbon icons accept `size` directly.
 * Color is set via the CSS `color` property on the parent or via `style.color`.
 */
function wrap(CarbonComp) {
  const WrappedIcon = ({ size = 16, color, style, className, ...rest }) => (
    <CarbonComp
      size={size}
      style={{ flexShrink: 0, color: color || undefined, ...style }}
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    />
  );
  WrappedIcon.displayName = CarbonComp.displayName || CarbonComp.name || 'CarbonIcon';
  return WrappedIcon;
}

// ─── Named exports using OFFICIAL @carbon/icons-react ───
export const DashboardIcon = wrap(Dashboard);
export const InformationIcon = wrap(Information);
export const EducationIcon = wrap(Education);
export const CertificateIcon = wrap(Certificate);
export const SunIcon = wrap(Sun);
export const MoonIcon = wrap(Moon);
export const CheckmarkIcon = wrap(Checkmark);
export const CheckmarkFilledIcon = wrap(CheckmarkFilled);
export const CheckmarkOutlineIcon = wrap(CheckmarkOutline);
export const CloseIcon = wrap(Close);
export const ArrowRightIcon = wrap(ArrowRight);
export const ArrowLeftIcon = wrap(ArrowLeft);
export const ChevronRightIcon = wrap(ChevronRight);
export const ChevronLeftIcon = wrap(ChevronLeft);
export const ChevronDownIcon = wrap(ChevronDown);
export const ChevronUpIcon = wrap(ChevronUp);
export const PlayFilledIcon = wrap(PlayFilled);
export const PlayIcon = wrap(Play);
export const StopIcon = wrap(StopFilled);
export const TimeIcon = wrap(Time);
export const CatalogIcon = wrap(Catalog);
export const StarFilledIcon = wrap(StarFilled);
export const StarIcon = wrap(Star);
export const FlagIcon = wrap(Flag);
export const GroupIcon = wrap(Group);
export const SproutIcon = wrap(Sprout);
export const SatelliteIcon = wrap(Satellite);
export const CropGrowthIcon = wrap(CropGrowth);
export const CloudIcon = wrap(Cloud);
export const DeliveryIcon = wrap(Delivery);
export const CopyIcon = wrap(Copy);
export const TrophyIcon = wrap(Trophy);
export const GameControllerIcon = wrap(GameConsole);
export const QuotesIcon = wrap(Quotes);
export const CodeIcon = wrap(Code);
export const WarningIcon = wrap(WarningAlt);
export const EditIcon = wrap(Edit);
export const AiIcon = wrap(Ai);
export const WatsonIcon = wrap(Ai);
export const EcoIcon = wrap(Earth);
export const DocumentIcon = wrap(Document);
export const SearchIcon = wrap(Search);
export const SettingsIcon = wrap(Settings);
export const RestartIcon = wrap(Restart);
export const LaunchIcon = wrap(Launch);
export const NotificationIcon = wrap(Notification);
export const TerminalIcon = wrap(Terminal);
export const IdeaIcon = wrap(Idea);
export const MicrophoneIcon = wrap(Microphone);
export const MicrophoneOffIcon = wrap(MicrophoneOff);
export const SendIcon = wrap(Send);
export const VolumeUpIcon = wrap(VolumeUp);
export const VolumeOffIcon = wrap(VolumeMute);
export const LocationIcon = wrap(Location);
export const UserIcon = wrap(UserAvatar);
export const RenewIcon = wrap(Renew);
export const AgricultureIcon = wrap(AgricultureAnalytics);
export const ChemistryIcon = wrap(Chemistry);
export const LaptopIcon = wrap(Laptop);
export const PolicyIcon = wrap(Policy);
export const InventoryIcon = wrap(InventoryManagement);
export const PartnershipIcon = wrap(Partnership);
export const VideoChatIcon = wrap(VideoChat);
export const BotIcon = wrap(Bot);
export const SchoolIcon = wrap(Education);
export const ExpandIcon = wrap(ChevronDown);
export const AiModelIcon = wrap(Ai);

// ─── Icon map for dynamic lookups ───
// Used by components that need to select icons dynamically (e.g., by lesson type)
export const ICON_MAP = {
  dashboard: DashboardIcon,
  information: InformationIcon,
  education: EducationIcon,
  certificate: CertificateIcon,
  checkmark: CheckmarkIcon,
  checkmarkFilled: CheckmarkFilledIcon,
  close: CloseIcon,
  arrowRight: ArrowRightIcon,
  arrowLeft: ArrowLeftIcon,
  chevronRight: ChevronRightIcon,
  chevronLeft: ChevronLeftIcon,
  chevronDown: ChevronDownIcon,
  play: PlayIcon,
  playFilled: PlayFilledIcon,
  stop: StopIcon,
  time: TimeIcon,
  catalog: CatalogIcon,
  starFilled: StarFilledIcon,
  flag: FlagIcon,
  group: GroupIcon,
  sprout: SproutIcon,
  satellite: SatelliteIcon,
  cropGrowth: CropGrowthIcon,
  cloud: CloudIcon,
  delivery: DeliveryIcon,
  copy: CopyIcon,
  trophy: TrophyIcon,
  gameController: GameControllerIcon,
  quotes: QuotesIcon,
  code: CodeIcon,
  warning: WarningIcon,
  edit: EditIcon,
  ai: AiIcon,
  watson: WatsonIcon,
  eco: EcoIcon,
  earth: EcoIcon,
  document: DocumentIcon,
  search: SearchIcon,
  restart: RestartIcon,
  launch: LaunchIcon,
  terminal: TerminalIcon,
  idea: IdeaIcon,
  microphone: MicrophoneIcon,
  send: SendIcon,
  volumeUp: VolumeUpIcon,
  location: LocationIcon,
  school: SchoolIcon,
  partnership: PartnershipIcon,
  agriculture: AgricultureIcon,
};
