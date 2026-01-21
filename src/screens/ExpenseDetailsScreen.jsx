import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientHeader from '../components/GradientHeader';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';

const ExpenseDetailsScreen = ({ route, navigation }) => {
    const { expense } = route.params;
    const { people, removeExpense } = useApp();

    const handleDelete = () => {
        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete this expense?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        removeExpense(expense.id);
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            <GradientHeader
                title={expense.name}
                subtitle={`₹${expense.amount.toFixed(2)}`}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Expense Info */}
                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoLabel}>
                            <Icon name="currency-inr" size={24} color={COLORS.primary} />
                            <Text style={styles.infoLabelText}>Total Amount</Text>
                        </View>
                        <Text style={styles.infoValue}>₹{expense.amount.toFixed(2)}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoLabel}>
                            <Icon name="account" size={24} color={COLORS.secondary} />
                            <Text style={styles.infoLabelText}>Paid By</Text>
                        </View>
                        <Text style={styles.infoValue}>{expense.payer.name}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoLabel}>
                            <Icon
                                name={expense.splitMode === 'equal' ? 'equal' : 'chart-pie'}
                                size={24}
                                color={COLORS.accent}
                            />
                            <Text style={styles.infoLabelText}>Split Method</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {expense.splitMode === 'equal' ? 'Equal Split' : 'Custom Split'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Split Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                        <Icon name="chart-box" size={20} color={COLORS.text} /> Split Breakdown
                    </Text>

                    {people.map((person) => {
                        const amount = expense.splits[person.id] || 0;
                        const isPayer = person.id === expense.payer.id;

                        return (
                            <View key={person.id} style={styles.splitRow}>
                                <View style={styles.personInfo}>
                                    <View style={[
                                        styles.avatar,
                                        isPayer && styles.avatarPayer,
                                    ]}>
                                        <Text style={styles.avatarText}>
                                            {person.name.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                    <View style={styles.personDetails}>
                                        <Text style={styles.personName}>{person.name}</Text>
                                        {isPayer && (
                                            <View style={styles.payerBadge}>
                                                <Icon name="cash" size={12} color={COLORS.white} />
                                                <Text style={styles.payerBadgeText}>Paid</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <View style={styles.amountContainer}>
                                    <Text style={styles.splitAmount}>₹{amount.toFixed(2)}</Text>
                                    <Text style={styles.splitPercentage}>
                                        {((amount / expense.amount) * 100).toFixed(0)}%
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Summary */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                        <Icon name="calculator" size={20} color={COLORS.text} /> Summary
                    </Text>

                    {people.map((person) => {
                        const owes = expense.splits[person.id] || 0;
                        const isPayer = person.id === expense.payer.id;
                        const balance = isPayer ? expense.amount - owes : -owes;

                        if (Math.abs(balance) < 0.01) return null;

                        return (
                            <View key={person.id} style={styles.summaryRow}>
                                <Text style={styles.summaryName}>{person.name}</Text>
                                <Text style={[
                                    styles.summaryAmount,
                                    balance > 0 ? styles.positiveBalance : styles.negativeBalance,
                                ]}>
                                    {balance > 0
                                        ? `Gets back ₹${balance.toFixed(2)}`
                                        : `Owes ₹${Math.abs(balance).toFixed(2)}`
                                    }
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Delete Button */}
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Icon name="delete" size={24} color={COLORS.white} />
                    <Text style={styles.deleteButtonText}>Delete Expense</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    card: {
        backgroundColor: COLORS.card,
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    infoLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoLabelText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginLeft: 12,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    badge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
    },
    splitRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    personInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: COLORS.textLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarPayer: {
        backgroundColor: COLORS.secondary,
    },
    avatarText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    personDetails: {
        flex: 1,
    },
    personName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    payerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginTop: 4,
        alignSelf: 'flex-start',
        gap: 4,
    },
    payerBadgeText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: '600',
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    splitAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    splitPercentage: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    summaryName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    summaryAmount: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    positiveBalance: {
        color: COLORS.success,
    },
    negativeBalance: {
        color: COLORS.danger,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.danger,
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 3,
        shadowColor: COLORS.danger,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    deleteButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default ExpenseDetailsScreen;