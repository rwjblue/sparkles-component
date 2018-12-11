type MemberDescriptor = {
  key: string;
  kind: 'class' | 'method' | 'field' | 'initializer';
  elements?: MemberDescriptor[];
  key: string;
  placement?: 'prototype' | 'static' | 'own';
  extras?: MemberDescriptor[];
  initializer?: () => any;
  descriptor?: PropertyDescriptor;
};

export function decoratorWithParams(
  fn: (desc: MemberDescriptor, params?: any[]) => MemberDescriptor
): any;
