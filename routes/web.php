<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ProductController::class, 'index'])->name('home');

Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::put('/cart/{cartItemId}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{cartItemId}', [CartController::class, 'destroy'])->name('cart.destroy');
Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::get('admin/products', [ProductController::class, 'admin'])->name('admin.products.index');
    Route::post('admin/products', [ProductController::class, 'store'])->name('admin.products.store');
    Route::patch('admin/products/{id}', [ProductController::class, 'update'])->name('admin.products.update');
    Route::delete('admin/products/{id}', [ProductController::class, 'destroy'])->name('admin.products.destroy');
    Route::patch('admin/products/{id}/toggle-active', [ProductController::class, 'toggleActive'])->name('admin.products.toggle-active');
    Route::patch('admin/products/{id}/toggle-featured', [ProductController::class, 'toggleFeatured'])->name('admin.products.toggle-featured');
    Route::patch('admin/products/{id}/update-stock', [ProductController::class, 'updateStock'])->name('admin.products.update-stock');


    Route::get('admin/categories', [ProductCategoryController::class, 'index'])->name('admin.categories.index');
    Route::post('admin/categories', [ProductCategoryController::class, 'store'])->name('admin.categories.store');
    Route::patch('admin/categories/{id}', [ProductCategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('admin/categories/{id}', [ProductCategoryController::class, 'destroy'])->name('admin.categories.destroy');
    Route::patch('admin/categories/{id}/toggle-active', [ProductCategoryController::class, 'toggleActive'])->name('admin.categories.toggle-active');


    Route::get('admin/users', [UserController::class, 'index'])->name('admin.users.index');
    Route::patch('admin/users/{id}', [UserController::class, 'update'])->name('admin.users.update');
    Route::patch('admin/users/{id}/toggle-active', [UserController::class, 'toggleActive'])->name('admin.users.toggle-active');
    Route::get('admin/admins', [UserController::class, 'admins'])->name('admin.admins.index');
    Route::post('admin/admins', [UserController::class, 'store'])->name('admin.admins.store');
    Route::patch('admin/admins/{id}', [UserController::class, 'updateAdmin'])->name('admin.admins.update');
    Route::patch('admin/admins/{id}/toggle-active', [UserController::class, 'toggleAdminActive'])->name('admin.admins.toggle-active');
});

require __DIR__.'/settings.php';
