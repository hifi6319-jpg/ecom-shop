export function generateWhatsAppUrl(order, items) {
    const adminPhone = "919876543210" // Replace with actual admin number

    let message = `*New Order #${order.id.slice(0, 8)}*\n\n`
    message += `*Customer:* ${order.customer_name}\n`
    message += `*Status:* Pending Payment\n\n`
    message += `*Items:*\n`

    items.forEach(item => {
        message += `- ${item.product_name} (${item.size}, ${item.color}) x${item.quantity} - ₹${item.price * item.quantity}\n`
    })

    message += `\n*Total:* ₹${order.total_amount}\n`
    message += `\nPlease confirm my order.`

    return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`
}
