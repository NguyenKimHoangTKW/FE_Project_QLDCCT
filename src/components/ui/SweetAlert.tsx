import Swal from "sweetalert2";

// Toast notification
export function SweetAlert(
  type: "success" | "error" | "warning" | "info",
  content: string
) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  Toast.fire({
    icon: type,
    title: content,
  });
}

export async function SweetAlertDel(content: string) {
  return Swal.fire({
    title: "Bạn đang thao tác xóa dữ liệu!",
    text: content,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Đồng ý xóa!",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      return true; 
    }
    return false; 
  });
}
