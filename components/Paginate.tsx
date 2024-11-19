import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { useState } from 'react';

export const Paginate = ({
	totalItems,
	itemsPerPage = 10,
	onPageChange,
}: {
	totalItems: number;
	itemsPerPage?: number;
	onPageChange: (page: number) => void;
}) => {
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		onPageChange(page);
	};

	const getPaginationItems = () => {
		const items = [];
		for (let page = 1; page <= totalPages; page++) {
			items.push(
				<PaginationItem key={page}>
					<PaginationLink
						href='#'
						onClick={(e) => {
							e.preventDefault();
							handlePageChange(page);
						}}
						isActive={page === currentPage}
					>
						{page}
					</PaginationLink>
				</PaginationItem>
			);
		}
		return items;
	};

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href='#'
						onClick={(e) => {
							e.preventDefault();
							if (currentPage > 1) handlePageChange(currentPage - 1);
						}}
					/>
				</PaginationItem>

				{getPaginationItems()}

				<PaginationItem>
					<PaginationNext
						href='#'
						onClick={(e) => {
							e.preventDefault();
							if (currentPage < totalPages) handlePageChange(currentPage + 1);
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};
