import React, { useState } from "react";
import { useTable, Column, TableOptions, useSortBy, usePagination, useFilters } from "react-table";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TextField,
  InputAdornment,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Checkbox,
  ListItemText,
  Typography,
} from "@mui/material";
import { AiOutlineSortAscending, AiOutlineSortDescending, AiOutlineSearch, AiOutlineFilter } from "react-icons/ai";
import { SelectChangeEvent } from "@mui/material";

function TableHOC<T extends Record<string, any>>(
  columns: Column<T>[],
  data: T[],
  containerClassName: string,
  heading: string,
  showPagination: boolean = false
) {
  return function HOC() {
    const options: TableOptions<T> = {
      columns,
      data,
      initialState: {
        pageSize: 5,
      },
    };

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      page,
      gotoPage,
      setPageSize,
      setFilter,
      state: { pageIndex, pageSize },
    } = useTable(options, useFilters, useSortBy, usePagination);

    // const [filters, setFilters] = useState<Record<string, string>>({});
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [selectedFilterField, setSelectedFilterField] = useState<string>("");
    const [filterValue, setFilterValue] = useState<string>("");
    const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map((column) => column.accessor as string));

    // Dynamically get column field names from columns
    const fieldNames = columns.map(column => column.accessor || column.Header);

    const handleFilterFieldChange = (event: SelectChangeEvent<string>) => {
      setSelectedFilterField(event.target.value);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilterValue(value);
      // Apply the filter to the selected field
      setFilter(selectedFilterField, value);
    };

    // Handle column visibility toggle
    const handleColumnVisibilityChange = (event: SelectChangeEvent<string[]>) => {
      const value = event.target.value;
      setVisibleColumns(Array.isArray(value) ? value : [value]);  // Ensure the value is always an array
    };

    return (
      <Box className={containerClassName} sx={{ p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 3, color: '#2e3b4e', fontWeight: 'bold' }}>
          {heading}
        </Typography>

        {/* Filter Section */}
        <Box display="flex" justifyContent="space-between" marginBottom={2} alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            {/* Filter By Column Dropdown */}
            <FormControl variant="outlined" size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Filter By</InputLabel>
              <Select
                value={selectedFilterField}
                onChange={handleFilterFieldChange}
                label="Filter By"
              >
                {/* Dynamically generate filter options based on columns */}
                {fieldNames.map((field, index) => (
                  <MenuItem key={index} value={String(field)}>
                    {field}
                  </MenuItem>
                ))}

              </Select>
            </FormControl>

            {/* Filter Input Field */}
            {selectedFilterField && (
              <TextField
                label={`Filter by ${selectedFilterField}`}
                variant="outlined"
                size="small"
                value={filterValue}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AiOutlineSearch />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: 250,
                  transition: "width 0.3s ease",
                }}
              />
            )}
          </Box>

          {/* Filter Icon Button */}
          <IconButton
            onClick={() => setActiveFilter(selectedFilterField)}
            color="primary"
            sx={{
              borderRadius: '50%',
              backgroundColor: '#3f51b5',
              padding: 1,
              '&:hover': {
                backgroundColor: '#303f9f',
              },
            }}
          >
            <AiOutlineFilter size={24} />
          </IconButton>
        </Box>

        {/* Column Visibility Dropdown */}
        <Box display="flex" justifyContent="space-between" marginBottom={2} alignItems="center">
          <FormControl variant="outlined" size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Visible Columns</InputLabel>
            <Select
              multiple
              value={visibleColumns}
              onChange={handleColumnVisibilityChange}
              label="Visible Columns"
              renderValue={(selected) => selected.join(", ")} // Join selected columns with commas
            >
              {fieldNames.map((field, index) => {
                // Ensure field is a valid string, number, or fallback if invalid
                const validField = typeof field === 'string' || typeof field === 'number' ? field : 'Default Value'; // Fallback value

                return (
                  <MenuItem key={index} value={validField}>
                    <Checkbox checked={visibleColumns.indexOf(validField) > -1} />
                    <ListItemText primary={validField} />
                  </MenuItem>
                );
              })}

            </Select>
          </FormControl>
        </Box>

        {/* Material UI Table */}
        <TableContainer sx={{ borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
          <Table {...getTableProps()} sx={{ minWidth: 650 }}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    // Skip column if not in visibleColumns
                    if (!visibleColumns.includes(column.id)) {
                      return null;
                    }
                    return (
                      <TableCell {...column.getHeaderProps(column.getSortByToggleProps())} sx={{ fontWeight: 'bold' }}>
                        {column.render("Header")}
                        {column.isSorted && (
                          <span>
                            {column.isSortedDesc ? (
                              <AiOutlineSortDescending />
                            ) : (
                              <AiOutlineSortAscending />
                            )}
                          </span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>

            <TableBody {...getTableBodyProps()}>
              {(showPagination ? page : rows).map((row) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      // Skip cell if its column is not in visibleColumns
                      if (!visibleColumns.includes(cell.column.id)) {
                        return null;
                      }
                      return (
                        <TableCell {...cell.getCellProps()}>{cell.render("Cell")}</TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        {showPagination && (
          <TablePagination
            component="div"
            count={rows.length}
            page={pageIndex}
            onPageChange={(event, newPage) => gotoPage(newPage)}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(event) => {
              const newSize = parseInt(event.target.value, 10);
              gotoPage(0);
              setPageSize(newSize);
            }}
            rowsPerPageOptions={[5, 10, 15]}
            sx={{
              borderTop: '1px solid #ddd',
              paddingTop: '10px',
            }}
          />
        )}
      </Box>
    );
  };
}

export default TableHOC;
