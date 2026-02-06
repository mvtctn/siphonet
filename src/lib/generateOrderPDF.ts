import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Order } from '@/store/useOrderStore'

interface CompanyInfo {
    name: string
    address: string
    phone: string
    email: string
    taxCode?: string
    logo?: string
}

// Company information - will be fetched from settings API
const getCompanyInfo = async (): Promise<CompanyInfo> => {
    try {
        const res = await fetch('/api/admin/settings')
        const data = await res.json()
        if (data.success && data.data?.site_info) {
            return {
                name: data.data.site_info.title || 'SIPHONET',
                address: data.data.site_info.address || '',
                phone: data.data.site_info.phone || '',
                email: data.data.site_info.email || '',
                logo: data.data.site_info.logo_url || '/logo.png'
            }
        }
    } catch (error) {
        console.error('Failed to fetch company info', error)
    }

    // Fallback
    return {
        name: 'SIPHONET',
        address: '',
        phone: '',
        email: '',
        logo: '/logo.png'
    }
}

/**
 * Generate PDF from HTML element
 */
const generatePDFFromElement = async (
    element: HTMLElement,
    filename: string,
    orientation: 'portrait' | 'landscape' = 'portrait'
): Promise<void> => {
    try {
        // Capture the element as canvas
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        })

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
            orientation,
            unit: 'mm',
            format: 'a4'
        })

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const imgWidth = canvas.width
        const imgHeight = canvas.height
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
        const imgX = (pdfWidth - imgWidth * ratio) / 2
        const imgY = 0

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
        pdf.save(filename)
    } catch (error) {
        console.error('Failed to generate PDF:', error)
        throw error
    }
}

/**
 * Create a temporary container for rendering PDF templates
 */
const createTempContainer = (): HTMLDivElement => {
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.left = '-9999px'
    container.style.top = '0'
    container.style.width = '210mm' // A4 width
    container.style.backgroundColor = 'white'
    document.body.appendChild(container)
    return container
}

/**
 * Remove temporary container
 */
const removeTempContainer = (container: HTMLDivElement) => {
    document.body.removeChild(container)
}

/**
 * Format currency in Vietnamese
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount)
}

/**
 * Format date in Vietnamese
 */
export const formatDate = (date: string | Date): string => {
    const d = new Date(date)
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(d)
}

/**
 * Generate Invoice PDF
 */
export const generateInvoice = async (order: Order): Promise<void> => {
    const companyInfo = await getCompanyInfo()
    const container = createTempContainer()

    // Create invoice HTML - Vietnamese standard format (no colors, black borders only)
    container.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif; color: #000000;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
                ${companyInfo.logo ? `<img src="${companyInfo.logo}" style="height: 50px; margin-bottom: 10px;" />` : ''}
                <h2 style="margin: 0; font-size: 16px; font-weight: bold; text-transform: uppercase;">${companyInfo.name}</h2>
                <p style="margin: 5px 0; font-size: 11px;">${companyInfo.address}</p>
                <p style="margin: 5px 0; font-size: 11px;">Điện thoại: ${companyInfo.phone} | Email: ${companyInfo.email}</p>
            </div>

            <div style="text-align: center; margin-bottom: 30px; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 15px 0;">
                <h1 style="margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase;">HÓA ĐƠN BÁN HÀNG</h1>
                <p style="margin: 10px 0 0 0; font-size: 12px;">Số: <strong>${order.orderCode}</strong> | Ngày: ${formatDate(order.createdAt)}</p>
            </div>

            <!-- Customer Info -->
            <div style="margin-bottom: 25px;">
                <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; text-transform: uppercase;">Thông tin khách hàng:</p>
                <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 4px 0; width: 120px;">Họ và tên:</td>
                        <td style="padding: 4px 0; font-weight: bold;">${order.customerName}</td>
                    </tr>
                    ${order.customerCompany ? `
                    <tr>
                        <td style="padding: 4px 0;">Công ty:</td>
                        <td style="padding: 4px 0;">${order.customerCompany}</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="padding: 4px 0;">Điện thoại:</td>
                        <td style="padding: 4px 0;">${order.customerPhone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0;">Email:</td>
                        <td style="padding: 4px 0;">${order.customerEmail}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; vertical-align: top;">Địa chỉ:</td>
                        <td style="padding: 4px 0;">${order.deliveryAddress}</td>
                    </tr>
                </table>
            </div>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; border: 1px solid #000;">
                <thead>
                    <tr>
                        <th style="padding: 8px; text-align: center; border: 1px solid #000; font-weight: bold;">STT</th>
                        <th style="padding: 8px; text-align: left; border: 1px solid #000; font-weight: bold;">Tên hàng hóa, dịch vụ</th>
                        <th style="padding: 8px; text-align: center; border: 1px solid #000; font-weight: bold;">Số lượng</th>
                        <th style="padding: 8px; text-align: right; border: 1px solid #000; font-weight: bold;">Đơn giá</th>
                        <th style="padding: 8px; text-align: right; border: 1px solid #000; font-weight: bold;">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map((item, idx) => `
                        <tr>
                            <td style="padding: 8px; text-align: center; border: 1px solid #000;">${idx + 1}</td>
                            <td style="padding: 8px; border: 1px solid #000;">${item.productName}</td>
                            <td style="padding: 8px; text-align: center; border: 1px solid #000;">${item.quantity}</td>
                            <td style="padding: 8px; text-align: right; border: 1px solid #000;">${formatCurrency(item.price)}</td>
                            <td style="padding: 8px; text-align: right; border: 1px solid #000;">${formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <!-- Total -->
            <div style="text-align: right; margin-bottom: 30px;">
                <table style="margin-left: auto; font-size: 13px;">
                    <tr>
                        <td style="padding: 5px 20px; text-align: right;">Tạm tính:</td>
                        <td style="padding: 5px 20px; text-align: right; min-width: 150px; font-weight: bold;">${formatCurrency(Number(order.totalAmount))}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 20px; text-align: right;">Phí vận chuyển:</td>
                        <td style="padding: 5px 20px; text-align: right;">0₫</td>
                    </tr>
                    <tr style="border-top: 1px solid #000;">
                        <td style="padding: 8px 20px; text-align: right; font-weight: bold;">TỔNG CỘNG:</td>
                        <td style="padding: 8px 20px; text-align: right; font-weight: bold; font-size: 15px;">${formatCurrency(Number(order.totalAmount))}</td>
                    </tr>
                </table>
            </div>

            <!-- Payment Info -->
            <div style="margin-bottom: 30px; border: 1px solid #000; padding: 12px;">
                <p style="margin: 0; font-size: 12px;"><strong>Hình thức thanh toán:</strong> ${order.paymentMethod}</p>
                <p style="margin: 5px 0 0 0; font-size: 12px;"><strong>Trạng thái thanh toán:</strong> ${order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
            </div>

            <!-- Signatures -->
            <div style="display: flex; justify-content: space-between; margin-top: 50px;">
                <div style="text-align: center; width: 45%;">
                    <p style="margin: 0; font-weight: bold; font-size: 12px;">NGƯỜI MUA HÀNG</p>
                    <p style="margin: 5px 0; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</p>
                    <div style="height: 80px;"></div>
                </div>
                <div style="text-align: center; width: 45%;">
                    <p style="margin: 0; font-weight: bold; font-size: 12px;">NGƯỜI BÁN HÀNG</p>
                    <p style="margin: 5px 0; font-size: 10px; font-style: italic;">(Ký, đóng dấu)</p>
                    <div style="height: 80px;"></div>
                </div>
            </div>

            <!-- Footer -->
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #000; text-align: center; font-size: 10px;">
                <p style="margin: 0;">Cảm ơn quý khách đã tin tưởng sử dụng sản phẩm của ${companyInfo.name}</p>
            </div>
        </div>
    `

    await generatePDFFromElement(container, `Hoa-don-${order.orderCode}.pdf`)
    removeTempContainer(container)
}

/**
 * Generate Delivery Note PDF
 */
export const generateDeliveryNote = async (order: Order): Promise<void> => {
    const companyInfo = await getCompanyInfo()
    const container = createTempContainer()

    // Vietnamese standard format (no colors, black borders only)
    container.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif; color: #000000;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 25px;">
                ${companyInfo.logo ? `<img src="${companyInfo.logo}" style="height: 50px; margin-bottom: 10px;" />` : ''}
                <h2 style="margin: 0; font-size: 16px; font-weight: bold; text-transform: uppercase;">${companyInfo.name}</h2>
                <p style="margin: 5px 0; font-size: 11px;">${companyInfo.address}</p>
                <p style="margin: 5px 0; font-size: 11px;">ĐT: ${companyInfo.phone} | Email: ${companyInfo.email}</p>
            </div>

            <div style="text-align: center; margin-bottom: 25px; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 15px 0;">
                <h1 style="margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase;">PHIẾU XUẤT KHO</h1>
                <p style="margin: 10px 0 0 0; font-size: 12px;">Số: <strong>${order.orderCode}</strong> | Ngày xuất: ${formatDate(order.createdAt)}</p>
            </div>

            <!-- Delivery Info -->
            <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; text-transform: uppercase;">Thông tin giao hàng:</p>
                <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 4px 0; width: 120px;">Người nhận:</td>
                        <td style="padding: 4px 0; font-weight: bold;">${order.customerName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0;">Điện thoại:</td>
                        <td style="padding: 4px 0;">${order.customerPhone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; vertical-align: top;">Địa chỉ giao:</td>
                        <td style="padding: 4px 0;">${order.deliveryAddress}</td>
                    </tr>
                </table>
            </div>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; border: 1px solid #000;">
                <thead>
                    <tr>
                        <th style="padding: 8px; text-align: center; border: 1px solid #000; font-weight: bold;">STT</th>
                        <th style="padding: 8px; text-align: left; border: 1px solid #000; font-weight: bold;">Mã SP</th>
                        <th style="padding: 8px; text-align: left; border: 1px solid #000; font-weight: bold;">Tên hàng hóa</th>
                        <th style="padding: 8px; text-align: center; border: 1px solid #000; font-weight: bold;">Số lượng</th>
                        <th style="padding: 8px; text-align: left; border: 1px solid #000; font-weight: bold;">Ghi chú</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map((item, idx) => `
                        <tr>
                            <td style="padding: 8px; text-align: center; border: 1px solid #000;">${idx + 1}</td>
                            <td style="padding: 8px; border: 1px solid #000; font-family: monospace; font-size: 10px;">${item.productId.slice(0, 8)}</td>
                            <td style="padding: 8px; border: 1px solid #000;">${item.productName}</td>
                            <td style="padding: 8px; text-align: center; border: 1px solid #000; font-weight: bold;">${item.quantity}</td>
                            <td style="padding: 8px; border: 1px solid #000;"></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <!-- Total Quantity -->
            <div style="text-align: right; margin-bottom: 40px; font-size: 13px; border: 1px solid #000; padding: 10px;">
                <strong>Tổng số lượng xuất kho: ${order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</strong>
            </div>

            <!-- Signatures -->
            <div style="display: flex; justify-content: space-between; margin-top: 50px;">
                <div style="text-align: center; width: 30%;">
                    <p style="margin: 0; font-weight: bold; font-size: 12px;">THỦ KHO</p>
                    <p style="margin: 5px 0; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</p>
                    <div style="height: 80px;"></div>
                </div>
                <div style="text-align: center; width: 30%;">
                    <p style="margin: 0; font-weight: bold; font-size: 12px;">NGƯỜI VẬN CHUYỂN</p>
                    <p style="margin: 5px 0; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</p>
                    <div style="height: 80px;"></div>
                </div>
                <div style="text-align: center; width: 30%;">
                    <p style="margin: 0; font-weight: bold; font-size: 12px;">NGƯỜI NHẬN HÀNG</p>
                    <p style="margin: 5px 0; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</p>
                    <div style="height: 80px;"></div>
                </div>
            </div>
        </div>
    `

    await generatePDFFromElement(container, `Phieu-xuat-kho-${order.orderCode}.pdf`)
    removeTempContainer(container)
}

/**
 * Generate Shipping Label PDF
 */
export const generateShippingLabel = async (order: Order): Promise<void> => {
    const companyInfo = await getCompanyInfo()
    const container = createTempContainer()

    // Vietnamese standard format (no colors, black borders only)
    container.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif; color: #000000;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 25px;">
                ${companyInfo.logo ? `<img src="${companyInfo.logo}" style="height: 50px; margin-bottom: 10px;" />` : ''}
                <h2 style="margin: 0; font-size: 16px; font-weight: bold; text-transform: uppercase;">${companyInfo.name}</h2>
                <p style="margin: 5px 0; font-size: 11px;">${companyInfo.address}</p>
                <p style="margin: 5px 0; font-size: 11px;">ĐT: ${companyInfo.phone} | Email: ${companyInfo.email}</p>
            </div>

            <div style="text-align: center; margin-bottom: 25px; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 15px 0;">
                <h1 style="margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase;">BẢN GIAO HÀNG</h1>
                <p style="margin: 10px 0 0 0; font-size: 12px;">Mã đơn hàng: <strong>${order.orderCode}</strong> | Ngày giao: ${formatDate(order.createdAt)}</p>
            </div>

            <!-- Sender Info -->
            <div style="margin-bottom: 20px; border: 1px solid #000; padding: 15px;">
                <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; text-transform: uppercase;">Người gửi:</p>
                <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 4px 0; width: 100px;">Công ty:</td>
                        <td style="padding: 4px 0; font-weight: bold;">${companyInfo.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0;">Địa chỉ:</td>
                        <td style="padding: 4px 0;">${companyInfo.address}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0;">Điện thoại:</td>
                        <td style="padding: 4px 0;">${companyInfo.phone}</td>
                    </tr>
                </table>
            </div>

            <!-- Receiver Info -->
            <div style="margin-bottom: 20px; border: 2px solid #000; padding: 15px;">
                <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; text-transform: uppercase;">Người nhận:</p>
                <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 4px 0; width: 100px;">Họ và tên:</td>
                        <td style="padding: 4px 0; font-size: 14px; font-weight: bold;">${order.customerName}</td>
                    </tr>
                    ${order.customerCompany ? `
                    <tr>
                        <td style="padding: 4px 0;">Công ty:</td>
                        <td style="padding: 4px 0;">${order.customerCompany}</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="padding: 4px 0;">Điện thoại:</td>
                        <td style="padding: 4px 0; font-size: 14px; font-weight: bold;">${order.customerPhone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; vertical-align: top;">Địa chỉ:</td>
                        <td style="padding: 4px 0; font-weight: bold; line-height: 1.6;">${order.deliveryAddress}</td>
                    </tr>
                </table>
            </div>

            <!-- Package Contents -->
            <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; text-transform: uppercase;">Nội dung hàng hóa:</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px; border: 1px solid #000;">
                    <thead>
                        <tr>
                            <th style="padding: 8px; text-align: center; border: 1px solid #000; font-weight: bold;">STT</th>
                            <th style="padding: 8px; text-align: left; border: 1px solid #000; font-weight: bold;">Tên hàng hóa</th>
                            <th style="padding: 8px; text-align: center; border: 1px solid #000; font-weight: bold;">SL</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map((item, idx) => `
                            <tr>
                                <td style="padding: 8px; text-align: center; border: 1px solid #000;">${idx + 1}</td>
                                <td style="padding: 8px; border: 1px solid #000;">${item.productName}</td>
                                <td style="padding: 8px; text-align: center; border: 1px solid #000; font-weight: bold;">${item.quantity}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p style="margin: 10px 0 0 0; font-size: 13px;"><strong>Tổng số kiện: ${order.items.reduce((sum, item) => sum + item.quantity, 0)}</strong></p>
            </div>

            <!-- Payment Info -->
            <div style="margin-bottom: 20px; border: 1px solid #000; padding: 12px;">
                <p style="margin: 0; font-size: 12px;"><strong>Giá trị đơn hàng:</strong> ${formatCurrency(Number(order.totalAmount))}</p>
                <p style="margin: 5px 0 0 0; font-size: 12px;"><strong>Thu tiền người nhận:</strong> ${order.paymentStatus === 'paid' ? '0₫ (Đã thanh toán)' : formatCurrency(Number(order.totalAmount))}</p>
            </div>

            <!-- Instructions -->
            <div style="margin-bottom: 30px; border: 1px solid #000; padding: 12px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold;">LƯU Ý GIAO HÀNG:</p>
                <ul style="margin: 0; padding-left: 20px; font-size: 11px; line-height: 1.8;">
                    <li>Kiểm tra kỹ hàng hóa trước khi giao</li>
                    <li>Gọi điện xác nhận trước khi giao</li>
                    <li>Yêu cầu người nhận ký xác nhận</li>
                    <li>Chụp ảnh bằng chứng giao hàng</li>
                </ul>
            </div>

            <!-- Signatures -->
            <div style="display: flex; justify-content: space-between; margin-top: 40px;">
                <div style="text-align: center; width: 45%;">
                    <p style="margin: 0; font-weight: bold; font-size: 12px;">NGƯỜI GIAO HÀNG</p>
                    <p style="margin: 5px 0; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</p>
                    <div style="height: 80px;"></div>
                    <p style="margin: 0; font-size: 10px;">Ngày: ___/___/______</p>
                </div>
                <div style="text-align: center; width: 45%;">
                    <p style="margin: 0; font-weight: bold; font-size: 12px;">NGƯỜI NHẬN HÀNG</p>
                    <p style="margin: 5px 0; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</p>
                    <div style="height: 80px;"></div>
                    <p style="margin: 0; font-size: 10px;">Ngày: ___/___/______</p>
                </div>
            </div>
        </div>
    `

    await generatePDFFromElement(container, `Ban-giao-hang-${order.orderCode}.pdf`)
    removeTempContainer(container)
}

/**
 * Generate all 3 documents and download as separate PDFs
 */
export const generateAllDocuments = async (order: Order): Promise<void> => {
    try {
        await generateInvoice(order)
        await new Promise(resolve => setTimeout(resolve, 500))

        await generateDeliveryNote(order)
        await new Promise(resolve => setTimeout(resolve, 500))

        await generateShippingLabel(order)

        alert('Đã tải xuống 3 file PDF thành công!')
    } catch (error) {
        console.error('Failed to generate documents:', error)
        alert('Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại.')
    }
}
