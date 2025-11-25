export default function IndexCTDTinterface() {
    return (

        <div className="main-content">
            <div className="page-header text-center">
                <h2 className="header-title">Chào mừng bạn đến với trang quản lý đề cương chi tiết</h2>
                <p className="text-muted">
                    Hệ thống quản lý đề cương chi tiết
                </p>
            </div>
            <div className="card mt-4">
                <div className="card-body text-center">
                    <img
                        src="/src/assets/images/logo/Icon.png"
                        alt="Welcome"
                        style={{ maxWidth: 200 }}
                    />
                    <h4 className="mt-3">Bắt đầu quản lý đề cương chi tiết một cách dễ dàng</h4>
                    <p className="text-muted">
                        Chọn một chức năng từ menu bên trái để tiếp tục quản lý đề cương chi tiết
                    </p>
                </div>
            </div>
            <style>
                {`
             .page-header {
        padding: 30px 0;
    }

    .header-title {
        font-size: 28px;
        font-weight: 600;
        color: #2c3e50;
    }

    .text-muted {
        color: #7f8c8d;
    }

    .card {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        border-radius: 12px;
    }
            `}
            </style>
        </div>
    )
}