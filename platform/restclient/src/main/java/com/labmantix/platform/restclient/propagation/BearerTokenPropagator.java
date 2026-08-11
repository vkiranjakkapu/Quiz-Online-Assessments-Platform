package com.labmantix.platform.restclient.propagation;

import org.springframework.http.HttpHeaders;

public interface BearerTokenPropagator {

    void propagate(HttpHeaders headers);

}
