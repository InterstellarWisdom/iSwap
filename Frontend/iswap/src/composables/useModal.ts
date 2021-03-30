import { ref } from "vue";

export default function useModal() {
  const visible = ref<boolean>(false);

  const showModal = () => {
    visible.value = true;
  };

  const handleOk = (e: MouseEvent) => {
    visible.value = false;
  };
  const handleCancel = (e: MouseEvent) => {
    visible.value = false
  }
  return {
    visible,
    showModal,
    handleOk,
    handleCancel
  }
}