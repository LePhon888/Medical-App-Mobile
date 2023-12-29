import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const ChatIntroduction = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                Chào mừng bạn đến với{'\n'}Trò chuyện Y tế
            </Text>
            <Text style={styles.subtitle}>
                Trò chuyện Y tế là một cách an toàn và thuận tiện để bệnh nhân và bác sĩ
                giao tiếp, chia sẻ thông tin và hợp tác về các vấn đề liên quan đến sức khỏe.
            </Text>
            <Text style={styles.howItWorksTitle}>Cách hoạt động:</Text>
            <Text style={styles.description}>
                1. Bắt đầu Cuộc trò chuyện: Khi bạn sẵn sàng thảo luận về triệu chứng,
                đặt câu hỏi hoặc tìm kiếm lời khuyên, chỉ cần khởi tạo cuộc trò chuyện. Bạn
                có thể trò chuyện với nhà cung cấp chăm sóc sức khỏe của mình hoặc kết nối
                với một bệnh nhân để được hỗ trợ và hướng dẫn.
            </Text>
            <Text style={styles.description}>
                2. Chia sẻ Thông tin: Mô tả triệu chứng, tiền sử bệnh lý hoặc bất kỳ mối lo
                ngại nào bạn có. Bạn cũng có thể gửi ảnh hoặc báo cáo để giúp truyền đạt
                tình hình của mình một cách rõ ràng hơn.
            </Text>
            <Text style={styles.description}>
                3. Nhận sự Hỗ trợ: Nếu bạn là bệnh nhân, các chuyên gia chăm sóc sức khỏe
                đang ở đây để cung cấp lời khuyên chuyên nghiệp, trả lời câu hỏi của bạn và
                đề xuất các chẩn đoán hoặc bước tiếp theo có thể thực hiện. Đối với bác sĩ,
                đây là cơ hội để hợp tác và chia sẻ kiến thức.
            </Text>
            <Text style={styles.description}>
                4. Luôn Cập nhật: Nền tảng của chúng tôi đảm bảo cuộc trò chuyện của bạn được
                bảo mật và an toàn. Bạn có thể tin tưởng rằng thông tin của bạn sẽ được giữ
                bí mật.
            </Text>
            <Text style={styles.getStartedTitle}>Bắt đầu:</Text>
            <Text style={styles.description}>
                Nếu bạn chưa kết nối với một nhà cung cấp dịch vụ chăm sóc sức khỏe hoặc bệnh
                nhân khác, bạn có thể sử dụng tính năng "Tham gia" trong hộp trò chuyện để
                bắt đầu một cuộc trò chuyện mới. Hãy nhớ rằng cuộc trò chuyện này hiệu quả
                nhất khi cả hai bên tham gia tích cực.
            </Text>
            <Text style={styles.contactInfo}>
                Nếu bạn có bất kỳ câu hỏi hoặc cần sự hỗ trợ, đừng ngần ngại hỏi. Sức khỏe
                của bạn là ưu tiên hàng đầu của chúng tôi.
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 5,
        textAlign: 'left',
    },
    howItWorksTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'left',
    },
    getStartedTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    finalNote: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'left',
    },
    contactInfo: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'left',
    },
});


export default ChatIntroduction;
