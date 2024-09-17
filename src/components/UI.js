import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as SelectPrimitive from '@radix-ui/react-select';

export const Input = ({ className, ...props }) => (
  <input className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props} />
);

export const Button = ({ className, children, ...props }) => (
  <button className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200 ${className}`} {...props}>
    {children}
  </button>
);

export const Card = ({ className, children }) => (
  <div className={`border rounded-lg shadow-md p-6 bg-white ${className}`}>{children}</div>
);

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogContent = ({ children, ...props }) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-50 animate-fade-in" />
    <DialogPrimitive.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl max-w-md w-full animate-scale-in" {...props}>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);

export const Select = SelectPrimitive.Root;
export const SelectTrigger = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
  <SelectPrimitive.Trigger ref={forwardedRef} className={`border rounded px-3 py-2 w-full text-left flex justify-between items-center ${className}`} {...props}>
    {children}
    <SelectPrimitive.Icon className="ml-2">▼</SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
export const SelectValue = SelectPrimitive.Value;
export const SelectContent = ({ children, ...props }) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content className="bg-white border rounded shadow-lg animate-scale-in" {...props}>
      <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);
export const SelectItem = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
  <SelectPrimitive.Item ref={forwardedRef} className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${className}`} {...props}>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));