import ItemModal from "./ItemModal";

function AddItemModal({
  visible,
  onDismiss,
  onSave,
}: {
  visible: boolean;
  onDismiss: () => void;
  onSave: (data: any) => void;
}) {
  return <ItemModal visible={visible} onDismiss={onDismiss} onSave={onSave} isEditing={false} />;
}

export default AddItemModal;
