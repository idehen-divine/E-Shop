<?php

namespace App\Enum;

enum PermissionEnum
{
    // Dashboard
    case VIEW_DASHBOARD;
    case VIEW_ANALYTICS;
    case VIEW_REPORTS;

    // Users
    case VIEW_USERS;
    case CREATE_USERS;
    case EDIT_USERS;
    case DELETE_USERS;
    case MANAGE_USER_ROLES;
    case MANAGE_USER_PERMISSIONS;

    // Products
    case VIEW_PRODUCTS;
    case CREATE_PRODUCTS;
    case EDIT_PRODUCTS;
    case DELETE_PRODUCTS;
    case MANAGE_PRODUCT_CATEGORIES;
    case MANAGE_PRODUCT_STOCK;

    // Orders
    case VIEW_ORDERS;
    case PROCESS_ORDERS;
    case REFUND_ORDERS;
    case VIEW_ORDER_REPORTS;

    // Settings
    case VIEW_SETTINGS;
    case MANAGE_GENERAL_SETTINGS;
    case MANAGE_SECURITY_SETTINGS;
    case MANAGE_PAYMENT_SETTINGS;
    case MANAGE_SHIPPING_SETTINGS;

    // Roles & Permissions
    case VIEW_ROLES;
    case CREATE_ROLES;
    case EDIT_ROLES;
    case DELETE_ROLES;
    case ASSIGN_PERMISSIONS;

    // Content Management
    case VIEW_CONTENT;
    case CREATE_CONTENT;
    case EDIT_CONTENT;
    case DELETE_CONTENT;
    case PUBLISH_CONTENT;

    // Reports & Analytics
    case VIEW_SALES_REPORTS;
    case VIEW_USER_REPORTS;
    case VIEW_PRODUCT_REPORTS;
    case EXPORT_REPORTS;

    // System
    case VIEW_LOGS;
    case MANAGE_BACKUPS;
    case MANAGE_SYSTEM;
    case ACCESS_API;
}
