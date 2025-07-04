<?php

use App\Http\Controllers\Api\VisaDocumentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('visa-documents', VisaDocumentController::class)->except(['show', 'update']);
    Route::get('visa-documents/{document}/download', [VisaDocumentController::class, 'download'])
        ->name('visa-documents.download');
});