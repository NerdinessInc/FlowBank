import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// utils
import { formatCurrency } from '@/utils/formatNumber';

const styles = StyleSheet.create({
	page: {
		padding: 30,
	},
	header: {
		fontSize: 18,
		marginBottom: 20,
	},
	section: {
		marginBottom: 10,
		fontSize: 12,
	},
	row: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#000',
		paddingTop: 8,
		paddingBottom: 8,
	},
	column: {
		flex: 1,
		fontSize: 10,
	},
});

export const StatementPDF = ({ accountHistory }: { accountHistory: any[] }) => (
	<Document>
		<Page size='A4' style={styles.page}>
			<View style={styles.section}>
				<Text>Account No: {accountHistory[0].COD_ACCT_NO}</Text>
				<Text>
					Opening Balance: NGN{formatCurrency(accountHistory[0].OPENING_BAL)}
				</Text>
				<Text>
					Available Balance: NGN{formatCurrency(accountHistory[0].CLOSING_BAL)}
				</Text>
				<Text>Account Type: {accountHistory[0].NAM_PRODUCT}</Text>
				<Text>
					Statement Period: {accountHistory[0].pSTART_DATE} -{' '}
					{accountHistory[0].END_DATE}
				</Text>
				<Text>Total Transactions: {accountHistory.length}</Text>
			</View>

			<View style={styles.section}>
				<Text>{accountHistory[0].NAM_CUST_FULL}</Text>
				<Text>{accountHistory[0].address}</Text>
			</View>

			<View style={styles.section}>
				<View style={styles.row}>
					<Text style={styles.column}>Account Number</Text>
					<Text style={styles.column}>Transaction Date</Text>
					<Text style={styles.column}>Transaction Amount</Text>
					<Text style={styles.column}>Narration</Text>
				</View>

				{accountHistory.map((account, index) => (
					<View key={index} style={styles.row}>
						<Text style={styles.column}>{account.COD_ACCT_NO}</Text>
						<Text style={styles.column}>{account.DAT_TXN}</Text>
						<Text style={styles.column}>
							NGN{formatCurrency(account.AMT_TXN)}
						</Text>
						<Text style={styles.column}>{account.TXT_TXN_DESC}</Text>
					</View>
				))}
			</View>
		</Page>
	</Document>
);
