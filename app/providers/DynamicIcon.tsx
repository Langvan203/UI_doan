// DynamicIcon.jsx
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  iconString: string;
}

const DynamicIcon = ({ iconString }: DynamicIconProps) => {
  // Parse icon string để lấy thông tin
  const parseIconString = (str:string) => {
    // Loại bỏ dấu ngoặc kép nếu có
    const cleanStr = str.replace(/^["']|["']$/g, '');
    
    // Extract icon name
    const iconMatch = cleanStr.match(/<(\w+)/);
    const iconName = iconMatch ? iconMatch[1] : null;
    
    // Extract props
    const propsMatch = cleanStr.match(/(\w+)="([^"]*)"/g);
    const props: { [key: string]: string } = {};
    
    if (propsMatch) {
      propsMatch.forEach(prop => {
        const [key, value] = prop.split('=');
        props[key] = value.replace(/"/g, '');
      });
    }
    
    return { iconName, props };
  };
  
  const { iconName, props } = parseIconString(iconString);
  
  // Lấy icon component từ lucide-react
  if (!iconName) {
    console.warn(`Icon name is null or undefined`);
    return null;
  }

  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];

  // Ensure IconComponent is a valid React component (function or has $$typeof)
  const isValidIconComponent =
    typeof IconComponent === 'function' ||
    (typeof IconComponent === 'object' && IconComponent !== null && '$$typeof' in IconComponent);

  if (!isValidIconComponent) {
    console.warn(`Icon ${iconName} not found or is not a valid React component`);
    return null;
  }

  // Type assertion to satisfy JSX requirements
  const ValidIconComponent = IconComponent as React.ElementType;

  return <ValidIconComponent {...props} />;
};

export default DynamicIcon;