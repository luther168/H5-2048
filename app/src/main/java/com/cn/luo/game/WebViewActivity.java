package com.cn.luo.game;

import android.databinding.DataBindingUtil;
import android.graphics.Bitmap;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.cn.luo.game.databinding.ActivityWebViewBinding;

public class WebViewActivity extends AppCompatActivity
        implements GestureDetector.OnGestureListener, View.OnClickListener {

    private static final String TAG = WebViewActivity.class.getName();

    private ActivityWebViewBinding binding;
    private GestureDetector detector;
    private int flingWidth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        initView();
    }

    private void initView() {
        binding = DataBindingUtil.setContentView(this, R.layout.activity_web_view);

        binding.layoutBack.setOnClickListener(this);
        binding.imgBrowserBack.setOnClickListener(this);
        binding.imgBrowserNext.setOnClickListener(this);

        initWebView();
    }

    private void initWebView() {
        binding.webview.getSettings().setDefaultTextEncodingName("UTF-8");
        binding.webview.setWebViewClient(new InnerWebViewClient());
        binding.webview.getSettings().setUseWideViewPort(true);
        binding.webview.getSettings().setLoadWithOverviewMode(true);
        binding.webview.getSettings().setJavaScriptEnabled(true);
        binding.webview.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);
        binding.webview.getSettings().setSupportZoom(true);
        binding.webview.getSettings().setAppCacheEnabled(true);
        binding.webview.getSettings().setDatabaseEnabled(true);
        binding.webview.getSettings().setDomStorageEnabled(true);

        binding.webview.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress == 100) {
                    binding.mProgress.setVisibility(View.GONE);
                } else {
                    if (View.GONE == binding.mProgress.getVisibility()) {
                        binding.mProgress.setVisibility(View.VISIBLE);
                    }
                    binding.mProgress.setProgress(newProgress);
                }
                super.onProgressChanged(view, newProgress);
            }
        });

        binding.webview.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onBackPressed() {
        if (binding.webview.canGoBack()) {
            binding.webview.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.layout_back:
                finish();
                break;
            case R.id.img_browser_back:
                if (binding.webview.canGoBack()) {
                    binding.webview.goBack();
                }
                break;
            case R.id.img_browser_next:
                if (binding.webview.canGoForward()) {
                    binding.webview.goForward();
                }
                break;
        }
    }

    @Override
    public boolean onDown(MotionEvent e) {
        return false;
    }

    @Override
    public void onShowPress(MotionEvent e) {
    }

    @Override
    public boolean onSingleTapUp(MotionEvent e) {
        return false;
    }

    @Override
    public boolean onScroll(MotionEvent e1, MotionEvent e2, float distanceX, float distanceY) {
        return false;
    }

    @Override
    public void onLongPress(MotionEvent e) {

    }

    @Override
    public boolean onFling(MotionEvent e1, MotionEvent e2, float velocityX, float velocityY) {
        if (e1 == null || e2 == null) {
            return false;
        }
        if (e2.getX() - e1.getX() > flingWidth && Math.abs(velocityX) > 200) {
            setResult(RESULT_CANCELED);
            finish();
            return true;
        }
        return false;
    }

    private class InnerWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            view.loadUrl(url);
            return true;
        }

        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            uiChange();
        }
    }

    public void uiChange() {
        if (binding.webview.canGoBack()) {
            binding.imgBrowserBack.setImageResource(R.drawable.icon_browser_back);
        } else {
            binding.imgBrowserBack.setImageResource(R.drawable.icon_browser_unback);
        }
        if (binding.webview.canGoForward()) {
            binding.imgBrowserNext.setImageResource(R.drawable.icon_browser_next);
        } else {
            binding.imgBrowserNext.setImageResource(R.drawable.icon_browser_unnext);
        }
    }
}
