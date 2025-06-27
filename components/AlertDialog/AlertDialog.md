<!-- // 基础用法
<AlertDialog
visible={visible}
message="这是一条普通提示"
onDismiss={() => setVisible(false)}
/>

// 成功提示
<AlertDialog
visible={visible}
type="success"
title="操作成功"
message="数据已保存"
onDismiss={() => setVisible(false)}
/>

// 警告提示（不可取消）
<AlertDialog
visible={visible}
type="warning"
title="警告"
message="确定要删除吗？"
showCancel={true}
dismissable={false}
onConfirm={handleDelete}
onDismiss={() => setVisible(false)}
/>

// 错误提示
<AlertDialog
visible={visible}
type="error"
title="错误"
message="操作失败，请重试"
onDismiss={() => setVisible(false)}
/> -->
