import ItemModal from "./ItemModal";

function EditItemModal({
  visible,
  onDismiss,
  onSave,
  onDelete,
  initialData,
}: {
  visible: boolean;
  onDismiss: () => void;
  onSave: (data: any) => void;
  onDelete: () => void;
  initialData: any;
}) {
  return (
    <ItemModal
      visible={visible}
      onDismiss={onDismiss}
      onSave={onSave}
      onDelete={onDelete}
      initialData={initialData}
      isEditing={true}
    />
  );
}

export default EditItemModal;
