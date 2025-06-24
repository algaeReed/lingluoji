# SwipeableRow 组件说明

## 功能

- 支持 iOS 风格两阶段滑动删除交互：
  - 向左轻滑，显示“编辑”和“删除”按钮
  - 继续向左滑超过阈值，隐藏编辑，删除按钮变宽，确认删除
  - 右滑关闭展开状态
- 支持自定义编辑和删除按钮内容
- 支持自定义列表项内容
- 带震动反馈和提示 Toast
- 删除确认弹窗
- 动画流畅，支持重置

## 组件接口

```tsx
type SwipeableRowProps = {
  id: string;
  children: React.ReactNode;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
  openRowId: string | null;
  setOpenRowId: (id: string | null) => void;
  renderEditButton?: () => React.ReactNode;
  renderDeleteButton?: () => React.ReactNode;
  showToast: (msg: string) => void;
};
```
