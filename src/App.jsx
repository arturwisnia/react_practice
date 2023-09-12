import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const users = usersFromServer;
const categories = categoriesFromServer;

const initialFilter = 'All';

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const products = productsFromServer.map((product) => {
    const category = categories.find(c => c.id === product.categoryId);
    const user = users.find(u => u.id === category.ownerId);

    return { ...product, category, user };
  });

  const filteredProducts = () => {
    let filtered = products;

    if (selectedUser !== 'All') {
      filtered = filtered.filter(product => product.user.name === selectedUser);
    }

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();

      filtered = filtered.filter(product => product.name
        .toLowerCase().includes(searchTermLower));
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories
        .includes(product.category.name));
    }

    return filtered;
  };

  const resetFilters = () => {
    setSelectedUser(initialFilter);
    setSearchTerm('');
    setSelectedCategories([]);
  };

  const handleCategoryClick = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories
        .filter(cat => cat !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };

  const handleSortClick = (column) => {
    if (column === sortColumn) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column) => {
    if (column === sortColumn) {
      return sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
    }

    return 'fa-sort';
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={selectedUser === 'All' ? 'is-active' : ''}
                onClick={() => setSelectedUser('All')}
              >
                All
              </a>

              {users.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUser === user.name ? 'is-active' : ''}
                  onClick={() => setSelectedUser(user.name)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchTerm && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchTerm('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6 ${selectedCategories.length === 0 ? '' : 'is-outlined'}`}
                onClick={resetFilters}
              >
                All
              </a>

              {categories.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${selectedCategories.includes(category.name) ? 'is-info' : ''}`}
                  href="#/"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {category.name}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            {filteredProducts()
              .length === 0 ? 'No products matching selected criteria' : ''}
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/" onClick={() => handleSortClick('id')}>
                      <span className="icon">
                        <i data-cy="SortIcon" className={`fas ${getSortIcon('id')}`} />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/" onClick={() => handleSortClick('name')}>
                      <span className="icon">
                        <i data-cy="SortIcon" className={`fas ${getSortIcon('name')}`} />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/" onClick={() => handleSortClick('category')}>
                      <span className="icon">
                        <i data-cy="SortIcon" className={`fas ${getSortIcon('category')}`} />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/" onClick={() => handleSortClick('user')}>
                      <span className="icon">
                        <i data-cy="SortIcon" className={`fas ${getSortIcon('user')}`} />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts().map(product => (
                <tr key={product.id} data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">
                    {
                  product.category.icon
                    }
                    -
                    {
                    product.category.name
                  }
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={product.user
                      .gender === 'male' ? 'has-text-link' : 'has-text-danger'}
                  >
                    {product.user.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
