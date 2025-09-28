import Swal from "sweetalert2";

export default function SweetAlert(type: "success" | "error" | "warning" | "info", content: string) {
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
